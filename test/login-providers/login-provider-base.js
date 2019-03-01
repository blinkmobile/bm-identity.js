'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const userConfigStoreMock = require('../helpers/user-config.js')
const requestMock = require('../helpers/request.js')

const TEST_SUBJECT = '../../lib/login-providers/login-provider-base.js'
const constants = require('../../lib/constants.js')

const CLIENT_ID = 'valid client id'
const JWT = 'valid jwt'
const USERNAME = 'username'
const PASSWORD = 'password'
const CONNECTION = 'username-password'

test.beforeEach((t) => {
  t.context.userConfigStore = userConfigStoreMock(() => {
    return Promise.resolve({ accessToken: JWT })
  })

  t.context.request = requestMock((url, data, callback) => {
    callback(null, {}, {
      id_token: JWT
    })
  })
})

test.cb('storeJWT() should return valid jwt', (t) => {
  const LoginProviderBase = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    '../utils/user-config.js': t.context.userConfigStore
  })
  const loginProviderBase = new LoginProviderBase(CLIENT_ID)

  loginProviderBase.storeJWT({ id_token: JWT })
    .then((jwt) => {
      t.is(jwt, JWT)
      t.end()
    })
    .catch(() => {
      t.fail()
      t.end()
    })
})

test.cb('requestJWT() should return valid jwt', (t) => {
  const LoginProviderBase = proxyquire(TEST_SUBJECT, {
    'request': t.context.request,
    '../utils/user-config.js': t.context.userConfigStore
  })
  const loginProviderBase = new LoginProviderBase(CLIENT_ID)

  loginProviderBase.requestJWT(USERNAME, PASSWORD, CONNECTION)
    .then((jwt) => {
      t.is(jwt, JWT)
      t.end()
    })
    .catch(() => {
      t.fail()
      t.end()
    })
})

test.cb('requestJWT() request for jwt should use correct data and url', (t) => {
  const LoginProviderBase = proxyquire(TEST_SUBJECT, {
    'request': requestMock((url, body, callback) => {
      t.is(url, `${constants.AUTH0_URL}/oauth/token`)
      t.deepEqual(body.json, {
        username: USERNAME,
        password: PASSWORD,
        client_id: CLIENT_ID,
        grant_type: 'password',
        scope: constants.SCOPE
      })
      t.end()
      callback(null, {}, {})
    }),
    '../utils/user-config.js': t.context.userConfigStore
  })
  const loginProviderBase = new LoginProviderBase(CLIENT_ID)

  loginProviderBase.requestJWT(USERNAME, PASSWORD, CONNECTION)
    .catch(() => {
      t.fail()
      t.end()
    })
})

test('requestJWT() should reject if request returns an error', (t) => {
  const LoginProviderBase = proxyquire(TEST_SUBJECT, {
    'request': requestMock((url, body, callback) => {
      callback(new Error('Test error message'))
    }),
    '../utils/user-config.js': t.context.userConfigStore
  })
  const loginProviderBase = new LoginProviderBase(CLIENT_ID)

  return t.throws(loginProviderBase.requestJWT(USERNAME, PASSWORD, CONNECTION), 'Test error message')
})

test.cb('requestJWT() should reject if request returns an bad connection error in the body', (t) => {
  const LoginProviderBase = proxyquire(TEST_SUBJECT, {
    'request': requestMock((url, body, callback) => {
      callback(null, {}, {
        error: 'error code',
        error_description: 'test error message'
      })
    }),
    '../utils/user-config.js': t.context.userConfigStore
  })
  const loginProviderBase = new LoginProviderBase(CLIENT_ID)

  loginProviderBase.requestJWT(USERNAME, PASSWORD, CONNECTION)
    .then(() => {
      t.fail()
      t.end()
    })
    .catch(error => {
      t.deepEqual(error, new Error('test error message'))
      t.end()
    })
})
