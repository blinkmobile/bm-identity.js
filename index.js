/* @flow */
'use strict'

const assumeRole = require('./lib/aws/assume-role.js')
const loginCommon = require('./lib/common/login.js')
const logoutCommon = require('./lib/common/logout.js')
const tenant = require('./lib/common/tenant.js')
const profile = require('./lib/auth0/profile.js')
const getJWT = require('./lib/utils/get-jwt.js')
const settings = require('./lib/common/settings.js')

const privateVars = new WeakMap()

/**
 * Class representing a Blink Mobile identity.
 */
class BlinkMobileIdentity {
  /**
   * Create a Blink Mobile identity.
   * @param {String} clientName - The name of the client.
   */
  constructor (
    clientName /* : string */
  ) {
    privateVars.set(this, {
      clientName
    })
  }

  /**
   * Login to a client using a Blink Mobile identity.
   * @param {Object} options - The login options.
   * @returns {String} The JWT generated after a successful login.
   */
  login (
    options /* : LoginOptions */
  ) /* : Promise<string> */ {
    return loginCommon.login((privateVars.get(this) || {}).clientName || '', options)
  }

  /**
   * Logout of the client.
   */
  logout () /* : Promise<void> */ {
    return logoutCommon.logout((privateVars.get(this) || {}).clientName)
  }

  /**
   * Get temporary AWS role's credentials.
   * @param {Object} Additional parameters to pass to the delegation endpoint.
   * @returns {Object} The AWS credentials.
   */
  assumeAWSRole (
    additionalParameters /* : Object */
  ) /* : Promise<Object> */ {
    return assumeRole((privateVars.get(this) || {}).clientName, additionalParameters)
  }

  /**
   * Get the Auth0 profile for the current user.
   * @param {String} [accessToken] - The access token generated after a successful login. If not passed, will attempt to get the access token from the file system.
   * @returns {Object} The Auth0 profile.
   */
  getProfile (
    accessToken /* : string | void */
  ) /* : Promise<Auth0Profile> */ {
    if (accessToken) {
      return profile.getByJWT(accessToken)
    } else {
      return profile.getByClient((privateVars.get(this) || {}).clientName)
    }
  }

  /**
   * Get access token generated after a successful login
   * @returns {String} The access token generated after a successful login.
   */
  getAccessToken () /* : Promise<string> */ {
    return getJWT()
  }

  /**
   * Get settings scoped to a BlinkMobile service.
   * @param {Object} additionalParameters - Additional parameters to pass to the settings endpoint.
   * @returns {Object} The settings.
   */
  getServiceSettings (
    additionalParameters /* : Object */
  ) /* : Promise<Object> */ {
    return settings((privateVars.get(this) || {}).clientName, additionalParameters)
  }

  /**
   * Show the currently set and available tenants.
   * @param {String} clientName - The name of a Client.
   */
  getTenants () /* : Promise<Tenants> */ {
    return tenant.get()
  }

  /**
   * Change the currently set tenant, will then show the currently set and available tenants.
   * @param {String} tenantName - The name of a tenant to set.
   */
  setTenant (
    tenantName /* : string */
  ) /* : Promise<Tenants> */ {
    return tenant.set(tenantName)
  }

  /**
   * Remove a tenant from the available tenants, will then show the currently set and available tenants.
   * @param {String} tenantName - The name of a tenant to remove.
   */
  removeTenant (
    tenantName /* : string */
  ) /* : Promise<Tenants> */ {
    return tenant.remove(tenantName)
  }
}

module.exports = BlinkMobileIdentity

/* ::
export type Auth0Identity = {
  user_id: string,
  provider: string,
  connection: string,
  isSocial: boolean
}

export type Auth0Profile = {
  email_verified: boolean,
  email: string,
  clientID: string,
  updated_at: string, // date
  name: string,
  picture: string, // url
  user_id: string,
  nickname: string,
  identities: Auth0Identity[],
  created_at: string, // date
  global_client_id: string
}

export type AWSCredentials = {
  accessKeyId : string,
  secretAccessKey : string,
  sessionToken : string
}

export type LoginOptions = {
  email?: string | true,
  password?: string,
  sms?: string | true,
  username?: string | true
}

export type Tenants = {
  current: string | void,
  previous: string[]
}

export type UserConfigStore = {
  load: () => Promise<Object>,
  update: (Object) => Promise<Object>
}
*/
