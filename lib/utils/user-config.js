'use strict'

/**
 * Module for getting the user config to load, update and write to.
 * @module utils/user-config
 */

const blinkmrc = require('@blinkmobile/blinkmrc')

const pkg = require('../../package.json')

let userConfigStore

function getStore () {
  if (!userConfigStore) {
    userConfigStore = blinkmrc.userConfig({ name: pkg.name })
  }
  return userConfigStore
}

module.exports = {
  getStore
}
