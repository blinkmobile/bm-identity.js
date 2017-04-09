'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const jsonwebtokenMock = require('../helpers/jsonwebtoken.js')

const TEST_SUBJECT = '../../lib/common/settings.js'

const CLIENT_NAME = 'validClientName'
const DATA = 'valid settings'
const DECODED = { serviceSettingsUrl: 'valid https url' }
const JWT = 'a valid jwt'
const PROJECT = 'validProjectName'

test.beforeEach((t) => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(TEST_SUBJECT, Object.assign({
      'request': (options, callback) => {
        callback(null, {statusCode: 200}, DATA)
      },

      'jsonwebtoken': jsonwebtokenMock((jwt) => DECODED),

      '../utils/get-jwt.js': (clientName) => Promise.resolve(JWT),

      '../auth0/client-factory.js': {
        getClientIdByName: () => Promise.resolve('client id')
      },

      '../auth0/verify-jwt.js': (jwt) => Promise.resolve(jwt)
    }, overrides))
  }
})

test('Should return a settings object', (t) => {
  const settings = t.context.getTestSubject()

  return settings(CLIENT_NAME)
    .then(data => t.is(data, DATA))
})

test('Should reject if a getJwt() throws an error', (t) => {
  const settings = t.context.getTestSubject({
    '../utils/get-jwt.js': (clientName) => Promise.reject(new Error('test error'))
  })

  return t.throws(settings(CLIENT_NAME), 'test error')
})

test('Should call decode()', (t) => {
  t.plan(1)
  const settings = t.context.getTestSubject({
    'jsonwebtoken': jsonwebtokenMock((jwt) => {
      t.pass()
      return DECODED
    })
  })

  return settings(CLIENT_NAME)
})

test('Should reject if decode() does not return valid payload', (t) => {
  const settings = t.context.getTestSubject({
    'jsonwebtoken': jsonwebtokenMock((jwt) => undefined)
  })

  return t.throws(settings(CLIENT_NAME), 'Malformed access token. Please login again.')
})

test('Should call request() with correct arguments', (t) => {
  t.plan(1)
  const settings = t.context.getTestSubject({
    'request': (options, callback) => {
      t.deepEqual(options, {
        auth: { 'bearer': JWT },
        json: true,
        method: 'GET',
        url: `${DECODED.serviceSettingsUrl}?bmService=${CLIENT_NAME}`
      })
      callback(null, {statusCode: 200}, {})
    }
  })
  return settings(CLIENT_NAME)
})

test('Should call request() with correct arguments for additional parameters', (t) => {
  t.plan(1)
  const settings = t.context.getTestSubject({
    'request': (options, callback) => {
      t.deepEqual(options, {
        auth: { 'bearer': JWT },
        json: true,
        method: 'GET',
        url: `${DECODED.serviceSettingsUrl}?bmProject=${PROJECT}&bmService=${CLIENT_NAME}`
      })
      callback(null, {statusCode: 200}, {})
    }
  })
  return settings(CLIENT_NAME, {bmProject: PROJECT})
})

test('Should reject if request() returns an error', (t) => {
  const settings = t.context.getTestSubject({
    'request': (options, callback) => callback(new Error('test error'))
  })

  return t.throws(settings(CLIENT_NAME), 'test error')
})

test('Should reject if request() does not return a 200 response', (t) => {
  const settings = t.context.getTestSubject({
    'request': (options, callback) => callback(null, {statusCode: 123}, {message: 'this is the error'})
  })

  return t.throws(settings(CLIENT_NAME), 'Could not find Service Settings: this is the error')
})
