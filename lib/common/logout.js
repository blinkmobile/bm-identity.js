/* @flow */
'use strict'

/* ::
import type {
  Tenant
} from '../..'
*/

/**
 * Module for common logout helpers.
 * @module common
 */

const request = require('request')

const getTenantData = require('../utils/get-tenant-data')
const userConfig = require('../utils/user-config.js')

/**
 * Logout of a client.
 */
async function logout(tenant /* : ?Tenant */) /* : Promise<void> */ {
  await new Promise((resolve, reject) => {
    const tenantConstants = getTenantData(tenant)
    request.get(
      `${tenantConstants.LOGIN_URL}/logout?client_id=${tenantConstants.LOGIN_CLIENT_ID}`,
      (err, status, body) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
    )
  })

  await userConfig.getStore().update(config => {
    // Removing accessToken as well as id_token to be backward compatible
    config.accessToken = undefined
    config.access_token = undefined
    config.id_token = undefined
    config.refresh_token = undefined
    return config
  })
}

module.exports = logout
