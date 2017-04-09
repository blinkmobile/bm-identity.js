'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const requestMock = require('../helpers/request.js')
const auth0ClientFactoryMock = require('../helpers/auth0-client-factory.js')

const TEST_SUBJECT = '../../lib/auth0/profile.js'

const JWT = 'a valid jwt'
const CLIENT_NAME = 'valid client name'
const CLIENT_ID = 'valid client id'
const PROFILE = {
  name: 'FirstName LastName',
  awsRoles: {
    cliRole: 'valid aws role ARN'
  }
}

test.beforeEach((t) => {
  t.context.getJWT = (clientName) => {
    return Promise.resolve(JWT)
  }

  t.context.verifyJWT = (jwt, clientId) => {
    return Promise.resolve(jwt)
  }

  t.context.request = requestMock((url, data, callback) => {
    callback(null, {}, PROFILE)
  })

  t.context.auth0ClientFactory = auth0ClientFactoryMock(() => {
    return Promise.resolve(CLIENT_ID)
  })
})

test.cb('getByClient() should call getJwt() to get access token with clientName', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    './client-factory.js': t.context.auth0ClientFactory,
    './verify-jwt.js': t.context.verifyJWT,
    '../utils/get-jwt.js': (clientName) => {
      t.is(clientName, CLIENT_NAME)
      t.end()
      return Promise.resolve(JWT)
    }
  })

  profile.getByClient(CLIENT_NAME)
    .catch((error) => {
      t.fail(error)
      t.end()
    })
})

test.cb('getByClient() should call getClientIdByName() to get client id with clientName', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    './client-factory.js': auth0ClientFactoryMock((clientName) => {
      t.is(clientName, CLIENT_NAME)
      t.end()
      return Promise.resolve(CLIENT_ID)
    }),
    './verify-jwt.js': t.context.verifyJWT,
    '../utils/get-jwt.js': t.context.getJWT
  })

  profile.getByClient(CLIENT_NAME)
    .catch((error) => {
      t.fail(error)
      t.end()
    })
})

test.cb('getByClient() should call verifyJwt() to verify jwt', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    './client-factory.js': t.context.auth0ClientFactory,
    './verify-jwt.js': (jwt, clientId) => {
      t.is(jwt, JWT)
      t.is(clientId, CLIENT_ID)
      t.end()
      return Promise.resolve(jwt)
    },
    '../utils/get-jwt.js': t.context.getJWT
  })

  profile.getByClient(CLIENT_NAME)
    .catch((error) => {
      t.fail(error)
      t.end()
    })
})

test.cb('getByClient() should return valid profile', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    './client-factory.js': t.context.auth0ClientFactory,
    './verify-jwt.js': t.context.verifyJWT,
    '../utils/get-jwt.js': t.context.getJWT
  })

  profile.getByClient(CLIENT_NAME)
    .then((profile) => {
      t.deepEqual(profile, PROFILE)
      t.end()
    })
    .catch((error) => {
      t.fail(error)
      t.end()
    })
})

test.cb('getByJWT() should return valid profile', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    '../utils/get-jwt.js': t.context.getJWT
  })

  profile.getByJWT(JWT)
    .then((profile) => {
      t.deepEqual(profile, PROFILE)
      t.end()
    })
    .catch((error) => {
      t.fail(error)
      t.end()
    })
})

test.cb('getByJWT() should reject if a jwt is not truthy', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    '../utils/get-jwt.js': t.context.getJWT
  })

  profile.getByJWT()
    .then(() => {
      t.fail()
      t.end()
    })
    .catch((error) => {
      t.deepEqual(new Error('Unauthenticated, please login before using this service.'), error)
      t.end()
    })
})

test.cb('getByJWT() should call request with the jwt token passed in', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': requestMock((url, data, callback) => {
      t.is(data.json.id_token, JWT)
      t.end()
      callback(null, {}, PROFILE)
    }),
    '../utils/get-jwt.js': t.context.getJWT
  })

  profile.getByJWT(JWT)
    .catch((error) => {
      t.fail(error)
      t.end()
    })
})

test('getByJWT() should reject if a request returns an error', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': requestMock((url, data, callback) => {
      callback(new Error('Test error message'))
    }),
    '../utils/get-jwt.js': t.context.getJWT
  })

  t.throws(profile.getByJWT(JWT), 'Test error message')
})

test.cb('getByJWT() should reject if a request returns \'Unauthorized\'', (t) => {
  const profile = proxyquire(TEST_SUBJECT, {
    'request': requestMock((url, data, callback) => {
      callback(null, {}, 'Unauthorized')
    }),
    '../utils/get-jwt.js': t.context.getJWT
  })

  profile.getByJWT(JWT)
    .then(() => {
      t.fail()
      t.end()
    })
    .catch((error) => {
      t.deepEqual(new Error('Unauthorised, your access token may have expired. Please login again.'), error)
      t.end()
    })
})
