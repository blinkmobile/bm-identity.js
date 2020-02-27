/* @flow */
'use strict'

/* ::
import type {
  Tenant,
  TenantData
} from '../..'
*/

const getTenantData = require('../utils/get-tenant-data')
const userConfig = require('../utils/user-config.js')

/**
 * Base class representing a login provider.
 */
class LoginProviderBase {
  /* ::
  CONSTANTS: TenantData
  */

  constructor(tenant /* : ?Tenant */) {
    this.CONSTANTS = getTenantData(tenant)
  }

  /**
   * Store the JWT generated after a successful login for later use.
   * @param {String} jwt - The JWT generated after a successful login.
   * @returns {String} The JWT generated after a successful login.
   */
  async storeJWT(
    body /* : {
      id_token: string,
      access_token: string,
      refresh_token: string
    } */,
  ) /* : Promise<void> */ {
    await userConfig.getStore().update(config => {
      // Setting accessToken as well as id_token to be backward compatible
      config.accessToken = body.id_token
      config.id_token = body.id_token
      config.access_token = body.access_token
      config.refresh_token = body.refresh_token
      return config
    })
  }
}

module.exports = LoginProviderBase
