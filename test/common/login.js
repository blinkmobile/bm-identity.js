'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const auth0ClientFactoryMock = require('../helpers/auth0-client-factory.js')
const loginProviderMock = require('../helpers/login-provider.js')

const TEST_SUBJECT = '../../lib/common/login.js'

const CLIENT_ID = 'valid client id'
const JWT = 'valid jwt'

test.beforeEach((t) => {
  t.context.auth0ClientFactory = auth0ClientFactoryMock(() => {
    return Promise.resolve(CLIENT_ID)
  })

  t.context.usernameLoginProvider = loginProviderMock((clientId, username, password) => {
    return Promise.resolve(JWT)
  })

  t.context.browserLoginProvider = loginProviderMock((clientId) => {
    return Promise.resolve(JWT)
  })

  t.context.clientName = 'Client Name'
})

test.cb('login() should return valid jwt from provider', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': t.context.auth0ClientFactory,
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': t.context.browserLoginProvider
  })

  commonLogin.login(t.context.clientName)
    .then((jwt) => {
      t.is(jwt, JWT)
      t.end()
    })
    .catch(() => {
      t.fail()
      t.end()
    })
})

test.cb('login() should call auth0ClientFactory with clientName from login', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': auth0ClientFactoryMock((clientName) => {
      t.is(clientName, t.context.clientName)
      t.end()
      return Promise.resolve(CLIENT_ID)
    }),
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': t.context.browserLoginProvider
  })

  commonLogin.login(t.context.clientName)
    .catch(() => {
      t.fail()
      t.end()
    })
})

test.cb('login() should create a usernameLoginProvider if all options are passed', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': t.context.auth0ClientFactory,
    '../login-providers/username.js': loginProviderMock((clientId, username, password) => {
      t.is(clientId, CLIENT_ID)
      t.is(username, 'test')
      t.is(password, 'pass')
      t.end()
      return Promise.resolve(JWT)
    }),
    '../login-providers/browser.js': t.context.browserLoginProvider
  })

  commonLogin.login(t.context.clientName, {
    username: 'test',
    password: 'pass'
  })
    .catch(() => {
      t.fail()
      t.end()
    })
})

test.cb('login() should create a usernameLoginProvider and call login() with null if username is passed in as true', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': t.context.auth0ClientFactory,
    '../login-providers/username.js': loginProviderMock((clientId, username, password) => {
      t.is(clientId, CLIENT_ID)
      t.is(username, null)
      t.is(password, 'pass')
      t.end()
      return Promise.resolve(JWT)
    }),
    '../login-providers/browser.js': t.context.browserLoginProvider
  })

  commonLogin.login(t.context.clientName, {
    username: true,
    password: 'pass'
  })
    .catch(() => {
      t.fail()
      t.end()
    })
})

test.cb('login() should create an browserLoginProvider if no option are passed', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': t.context.auth0ClientFactory,
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': loginProviderMock((clientId, phoneNumber) => {
      t.is(clientId, CLIENT_ID)
      t.end()
      return Promise.resolve(JWT)
    })
  })

  commonLogin.login(t.context.clientName)
    .catch(() => {
      t.fail()
      t.end()
    })
})

test('login() should set the correct default for storeJwt option', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': t.context.auth0ClientFactory,
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': loginProviderMock((clientId, storeJwt) => {
      t.falsy(storeJwt)
      return Promise.resolve(JWT)
    })
  })

  return commonLogin.login(t.context.clientName)
})

test('login() should leave the storeJwt option as true is set to true', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': t.context.auth0ClientFactory,
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': loginProviderMock((clientId, storeJwt) => {
      t.is(storeJwt, true)
      return Promise.resolve(JWT)
    })
  })

  return commonLogin.login(t.context.clientName, { storeJwt: true })
})

test('login() should leave the storeJwt option as false is set to false', (t) => {
  const commonLogin = proxyquire(TEST_SUBJECT, {
    '../auth0/client-factory.js': t.context.auth0ClientFactory,
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': loginProviderMock((clientId, storeJwt) => {
      t.is(storeJwt, false)
      return Promise.resolve(JWT)
    })
  })

  return commonLogin.login(t.context.clientName, { storeJwt: false })
})
