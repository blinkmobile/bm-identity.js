'use strict';

/**
 * Module for adding, removing and setting tenant.
 * @module common/tenant
 */

const userConfigStore = require('../utils/user-config.js');

/**
 * Show the currently set and previous tenants.
 * @function show
 * @param {String} clientName - The name of a Client.
 */
function get () {
  return userConfigStore.load().then((config) => config.tenants);
}

/**
 * Change the currently set tenant, will then show the currently set and previous tenants.
 * @function set
 * @param {String} tenantName - The name of a tenant to set.
 */
function set (tenantName) {
  if (!tenantName) {
    return Promise.reject(new Error('Must specify a tenant to set'));
  }
  return userConfigStore.update((config) => {
    config.tenants = config.tenants || {};
    config.tenants.previous = config.tenants.previous || [];
    // Push into array
    if (config.tenants.previous.indexOf(tenantName) === -1) {
      config.tenants.previous.push(tenantName);
    }
    // Set as current
    config.tenants.current = tenantName;
    return config;
  }).then((config) => config.tenants);
}

/**
 * Remove a tenant from the previous tenants, will then show the currently set and previous tenants.
 * @function remove
 * @param {String} tenantName - The name of a tenant to remove.
 */
function remove (tenantName) {
  if (!tenantName) {
    return Promise.reject(new Error('Must specify a tenant to remove'));
  }
  return userConfigStore.update((config) => {
    config.tenants = config.tenants || {};
    config.tenants.previous = config.tenants.previous || [];
    const index = config.tenants.previous.indexOf(tenantName);
    // Remove from array
    if (index > -1) {
      config.tenants.previous.splice(index, 1);
    }
    // Remove from current
    if (config.tenants.current === tenantName) {
      delete config.tenants.current;
    }
    return config;
  }).then((config) => config.tenants);
}

module.exports = {
  get,
  set,
  remove
};
