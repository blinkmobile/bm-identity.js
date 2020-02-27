/* @flow */
'use strict'

/* ::
import type {
  Tenant,
  TenantData
} from '../..'
*/

const constants = require('../constants')

module.exports = function getTenantData(
  tenant /* : ?Tenant */,
) /* : TenantData */ {
  return tenant && constants.TENANTS[tenant]
    ? constants.TENANTS[tenant]
    : constants.TENANTS.ONEBLINK
}
