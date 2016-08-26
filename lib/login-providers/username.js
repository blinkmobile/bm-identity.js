'use strict';

const inquirer = require('inquirer');
const _ = require('lodash');

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
   * @param {String} clientName - The name of the client.
   */
  constructor (clientId, clientName) {
    super(clientId, clientName);

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
    const usernameIsString = _.isString(username);
    const passwordIsString = _.isString(password);
    if (usernameIsString && passwordIsString) {
      return Promise.resolve({
        username,
        password
      });
    }

    let questions = [];
    if (!usernameIsString) {
      questions.push({
        type: 'input',
        name: 'username',
        message: 'BlinkMobile Username: '
      });
    }
    if (!passwordIsString) {
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

// test.cb('usernameLoginProvider.login request should contain username and password from prompt and clientId from constructor', (t) => {
//   const UsernameLoginProvider = proxyquire(TEST_SUBJECT, {
//     'inquirer': inquirerMock((questions) => {
//       return Promise.resolve({
//         username: USERNAME,
//         password: PASSWORD
//       });
//     }),
//     './login-provider-base.js': loginProviderBaseMock(null, (clientId, username, password, connection) => {
//       t.is(clientId, CLIENT_ID);
//       t.is(username, USERNAME);
//       t.is(password, PASSWORD);
//       t.is(connection, 'Username-Password-Authentication');
//       t.end();
//       return Promise.resolve(JWT);
//     })
//   });
//   const usernameLoginProvider = new UsernameLoginProvider(CLIENT_ID, CLIENT_NAME);

//   usernameLoginProvider.login();
// });

// test.cb('usernameLoginProvider.login should should reject if loginProviderBase returns an error', (t) => {
//   const UsernameLoginProvider = proxyquire(TEST_SUBJECT, {
//     'inquirer': t.context.inquirer,
//     './login-provider-base.js': loginProviderBaseMock(null, (clientId, username, password, connection) => {
//       return Promise.reject('Test error message');
//     })
//   });
//   const usernameLoginProvider = new UsernameLoginProvider(CLIENT_ID, CLIENT_NAME);

//   usernameLoginProvider.login()
//     .catch(error => {
//       t.is(error, 'Test error message');
//       t.end();
//     });
// });

// test.cb('usernameLoginProvider.login should should reject if request returns an error in the body', (t) => {
//   const UsernameLoginProvider = proxyquire(TEST_SUBJECT, {
//     'inquirer': t.context.inquirer,
//     'request': requestMock((url, body, callback) => {
//       callback(null, {}, {
//         error: 'error code',
//         error_description: 'test error message'
//       });
//     }),
//     './login-provider-base.js': t.context.loginProviderBase
//   });
//   const usernameLoginProvider = new UsernameLoginProvider(CLIENT_ID, CLIENT_NAME);

//   usernameLoginProvider.login()
//     .catch(error => {
//       t.is(error, 'error code: test error message');
//       t.end();
//     });
// });
