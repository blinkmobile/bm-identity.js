'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const requestMock = require('../helpers/request.js')
const jsonwebtokenMock = require('../helpers/jsonwebtoken.js')
const userConfigStoreMock = require('../helpers/user-config.js')

const TEST_SUBJECT = '../../lib/auth0/verify-jwt.js'
const constants = require('../../lib/constants.js')

const JWT = 'a valid jwt'
const CLIENT_ID = 'valid client id'
const DECODED = {
  exp: (Date.now() / 1000) + 43200, // 12 hours after tests are run
  refreshIdTokenBeforeSeconds: 86400 // 24 hours
}
const DATA = {
  id_token: JWT
}

test.beforeEach((t) => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(TEST_SUBJECT, Object.assign({
      'request': requestMock((url, data, callback) => {
        callback(null, {}, DATA)
      }),

      'jsonwebtoken': jsonwebtokenMock((jwt) => {
        return DECODED
      }),

      '../utils/user-config.js': userConfigStoreMock(null, (updateFn) => {
        return Promise.resolve(updateFn({}))
      })
    }, overrides))
  }
})

test('verifyJWT() should return a jwt', (t) => {
  const verifyJWT = t.context.getTestSubject()

  return verifyJWT(JWT, CLIENT_ID)
    .then(jwt => {
      t.is(jwt, JWT)
    })
})

test('verifyJWT() should reject if a jwt is not passed in', (t) => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject()

  return verifyJWT(null, CLIENT_ID)
    .catch((error) => {
      t.deepEqual(error, new Error('Unauthenticated, please login before using this service.'))
    })
})

test('verifyJWT() should call decode()', (t) => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    'jsonwebtoken': jsonwebtokenMock((jwt) => {
      t.pass()
      return DECODED
    })
  })

  return verifyJWT(JWT, CLIENT_ID)
})

test('verifyJWT() should reject if decode() does not return an object with an exp property', (t) => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    'jsonwebtoken': jsonwebtokenMock((jwt) => {
      return null
    })
  })

  return verifyJWT(JWT, CLIENT_ID)
    .catch((error) => {
      t.deepEqual(error, new Error('Malformed access token. Please login again.'))
    })
})

test('verifyJWT() should reject if jwt is expired', (t) => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    'jsonwebtoken': jsonwebtokenMock((jwt) => {
      return {
        exp: (Date.now() / 1000) - 1 // 1 second before test is run (expired)
      }
    })
  })

  return verifyJWT(JWT, CLIENT_ID)
    .catch((error) => {
      t.deepEqual(error, new Error('Unauthorised, your access token has expired. Please login again.'))
    })
})

test('verifyJWT() should call request.post() if jwt expires after a certain period', (t) => {
  t.plan(2)
  const verifyJWT = t.context.getTestSubject({
    'request': requestMock((url, body, callback) => {
      t.is(url, `${constants.AUTH0_URL}/delegation`)
      t.deepEqual(body.json, {
        client_id: CLIENT_ID,
        id_token: JWT,
        scope: 'passthrough',
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        api_type: 'auth0'
      })
      callback(null, {}, {})
    })
  })

  return verifyJWT(JWT, CLIENT_ID)
})

test('verifyJWT() should reject if request.post() returns an error', (t) => {
  const verifyJWT = t.context.getTestSubject({
    'request': requestMock((url, body, callback) => {
      callback(new Error('Test error message'))
    })
  })

  t.throws(verifyJWT(JWT, CLIENT_ID), 'Test error message')
})

test('verifyJWT() should reject if request.post() returns an error in the body', (t) => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    'request': requestMock((url, body, callback) => {
      callback(null, {}, {
        error: 'error code',
        error_description: 'test error message'
      })
    })
  })

  return verifyJWT(JWT, CLIENT_ID)
    .catch((error) => {
      t.deepEqual(error, new Error('test error message'))
    })
})

test('verifyJWT() should call userConfigStore.update() to save the jwt', (t) => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    '../utils/user-config.js': userConfigStoreMock(null, (updateFn) => {
      const config = updateFn({})
      t.deepEqual(config, {
        accessToken: JWT
      })
      return Promise.resolve()
    })
  })

  return verifyJWT(JWT, CLIENT_ID)
})

test('verifyJWT() should return the passed in jwt if it is valid for longer the the refresh period', (t) => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    'request': requestMock((url, body, callback) => {
      t.fail('Should not get to here')
      callback(null, {}, {})
    }),
    'jsonwebtoken': jsonwebtokenMock((jwt) => {
      return {
        exp: (Date.now() / 1000) + (86400 * 3) // 3 days after tests are run
      }
    })
  })

  return verifyJWT(JWT, CLIENT_ID)
    .then(jwt => {
      t.is(jwt, JWT)
    })
})
