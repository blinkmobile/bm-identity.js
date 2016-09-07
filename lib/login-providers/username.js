'use strict';

const inquirer = require('inquirer');

const LoginProviderBase = require('./login-provider-base.js');

const privateVars = new WeakMap();

/**
 * Class representing a username login provider.
 */
class UsernameLoginProvider extends LoginProviderBase {
  /**
   * Create a username login provider.
   * @augments LoginProviderBase
   * @param {String} clientId - The Id of the client.
   */
  constructor (clientId) {
    super(clientId);

    privateVars.set(this, {
      clientId
    });
  }

  /**
   * Login to a client using a Blink Mobile identity with a username and password login provider.
   * @param {String} username - The username.
   * @param {String} password - The password.
   * @returns {String} The JWT generated after a successful login.
   */
  login (username, password) {
    return this._getCredentials(username, password).then(results => {
      if (!results.username) {
        return Promise.reject('Please specify a username.');
      }
      if (!results.password) {
        return Promise.reject('Please specify a password.');
      }

      return super.requestJWT(results.username, results.password, 'Username-Password-Authentication');
    });
  }

  _getCredentials (username, password) {
    if (username && password) {
      return Promise.resolve({
        username,
        password
      });
    }

    let questions = [];
    if (!username) {
      questions.push({
        type: 'input',
        name: 'username',
        message: 'BlinkMobile Username: '
      });
    }
    if (!password) {
      questions.push({
        type: 'password',
        name: 'password',
        message: 'BlinkMobile Password: '
      });
    }
    return inquirer.prompt(questions).then(results => {
      results.username = results.username || username;
      results.password = results.password || password;
      return results;
    });
  }
}

module.exports = UsernameLoginProvider;
