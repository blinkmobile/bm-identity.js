'use strict'

const privateVars = new WeakMap()

function loginProviderBaseMock (storeJwtFn, requestJwtFn) {
  storeJwtFn = storeJwtFn || ((jwt) => Promise.resolve(jwt))
  requestJwtFn = requestJwtFn || ((u, p, c) => Promise.resolve('jwt'))
  return class LoginProvider {
    constructor (clientId, clientName) {
      privateVars.set(this, {
        clientId,
        clientName
      })
    }

    storeJWT (jwt) {
      return storeJwtFn(jwt)
    }

    requestJWT (username, password, connection) {
      return requestJwtFn(username, password, connection)
    }
  }
}

module.exports = loginProviderBaseMock
