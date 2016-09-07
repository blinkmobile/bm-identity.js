'use strict';

/**
 * Module for getting the user config to load, update and write to.
 * @module utils/user-config
 */

const blinkmrc = require('@blinkmobile/blinkmrc');

const pkg = require('../../package.json');

module.exports = blinkmrc.userConfig({ name: pkg.name });
