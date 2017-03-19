/* @flow */
'use strict'

/**
 * Module for getting the user config to load, update and write to.
 * @module utils/user-config
 */

/* ::
import type {
  UserConfigStore
} from '../..'
*/

const blinkmrc = require('@blinkmobile/blinkmrc')

const pkg = require('../../package.json')

let userConfigStore

function getStore () /* : UserConfigStore */ {
  if (!userConfigStore) {
    userConfigStore = blinkmrc.userConfig({ name: pkg.name })
  }
  return userConfigStore
}

module.exports = {
  getStore
}
