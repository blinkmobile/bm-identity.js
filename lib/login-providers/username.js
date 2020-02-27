/* @flow */
'use strict'

/* ::
import type {
  Tenant
} from '../..'
*/

const AWS = require('aws-sdk')
const inquirer = require('inquirer')

const LoginProviderBase = require('./login-provider-base.js')

/**
 * Class representing a username login provider.
 */
class UsernameLoginProvider extends LoginProviderBase {
  /**
   * Login to a client using a Blink Mobile identity with a username and password login provider.
   * @param {String} username - The username.
   * @param {String} password - The password.
   * @returns {String} The JWT generated after a successful login.
   */
  async login(
    username /* : string | null */,
    password /* : string | void */,
    storeJwt /* : ?boolean */,
  ) /* : Promise<string> */ {
    const results = await this._getCredentials(username, password)
    if (!results.username) {
      return Promise.reject(new Error('Please specify a username.'))
    }
    if (!results.password) {
      return Promise.reject(new Error('Please specify a password.'))
    }

    return this._requestJWT(results.username, results.password, storeJwt)
  }

  async _getCredentials(
    username /* : string | null */,
    password /* : string | void */,
  ) /* : Promise<{ username: string, password: string }> */ {
    if (username && password) {
      return Promise.resolve({
        username,
        password,
      })
    }

    const questions = []
    if (!username) {
      questions.push({
        type: 'input',
        name: 'username',
        message: 'BlinkMobile Username: ',
      })
    }
    if (!password) {
      questions.push({
        type: 'password',
        name: 'password',
        message: 'BlinkMobile Password: ',
      })
    }
    const results = await inquirer.prompt(questions)
    results.username = results.username || username
    results.password = results.password || password
    return results
  }

  /**
   * Request a JWT via login. This will internally store the JWT as well.
   * @param {String} username - The username to login with.
   * @param {String} password - The password to login with.
   * @returns {String} The JWT generated after a successful login.
   */
  async _requestJWT(
    username /* : string */,
    password /* : string */,
    storeJwt /* : ?boolean */,
  ) /* : Promise<string> */ {
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
      {
        region: this.CONSTANTS.AWS_REGION,
      },
    )

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.CONSTANTS.LOGIN_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }
    const {
      AuthenticationResult,
    } = await cognitoIdentityServiceProvider.initiateAuth(params).promise()

    if (storeJwt) {
      // Must use this.storeJWT instead of super.storeJWT to support bug in Node 4.
      await this.storeJWT({
        accessToken: AuthenticationResult.IdToken,
        id_token: AuthenticationResult.IdToken,
        access_token: AuthenticationResult.AccessToken,
        refresh_token: AuthenticationResult.RefreshToken,
      })
    }

    return AuthenticationResult.IdToken
  }
}

module.exports = UsernameLoginProvider
