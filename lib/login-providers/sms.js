/* @flow */
'use strict'

const request = require('request')
const inquirer = require('inquirer')

const constants = require('../constants.js')
const LoginProviderBase = require('./login-provider-base.js')

const privateVars = new WeakMap()

/**
 * Class representing a SMS login provider.
 */
class SMSLoginProvider extends LoginProviderBase {
  /**
   * Create an SMS login provider.
   * @augments LoginProviderBase
   * @param {String} clientId - The Id of the client.
   */
  constructor (clientId /* : string */) {
    super(clientId)

    privateVars.set(this, {
      clientId
    })
  }

  /**
   * Login to a client using a Blink Mobile identity with an SMS login provider.
   * @param {String} phoneNumber- The phone number to send a verification code to.
   * @returns {String} The JWT generated after a successful login.
   */
  login (
    phoneNumber /* : string | null */
  ) /* : Promise<string> */ {
    return this._verifyPhoneNumber(phoneNumber)
      .then(verifiedPhoneNumber => this._startPasswordless(verifiedPhoneNumber))
      .then(verifiedPhoneNumber => super.promptForCode('Please check your phone and enter the verification code: ', verifiedPhoneNumber, 'sms'))
  }

  _startPasswordless (
    phoneNumber /* : string */
  ) /* : Promise<string> */ {
    return new Promise((resolve, reject) => {
      // Send message to user with verification code.
      request.post(`${constants.AUTH0_URL}/passwordless/start`, {
        json: {
          client_id: (privateVars.get(this) || {}).clientId,
          connection: 'sms',
          phone_number: phoneNumber
        }
      }, (err, status, body) => {
        if (err) {
          reject(err)
          return
        }
        if (body.error) {
          // catch errors we want to have a nice message for.
          switch (body.error_description) {
            case 'Connection does not exist': {
              return reject(new Error('This BlinkMobile service does not provide SMS driven passwordless authentication. Please use another type of authentication to login.'))
            }
            default: {
              return reject(new Error(body.error_description))
            }
          }
        }

        resolve(phoneNumber)
      })
    })
  }

  _verifyPhoneNumber (
    phoneNumber /* : string | null */
  ) /* : Promise<string> */ {
    if (phoneNumber) {
      return Promise.resolve(phoneNumber)
    }

    return inquirer.prompt([{
      type: 'input',
      name: 'phoneNumber',
      message: 'Phone Number: '
    }]).then(results => {
      if (!results.phoneNumber) {
        return Promise.reject(new Error('Please specify a phone number to send verification code to.'))
      }
      return results.phoneNumber
    })
  }
}

module.exports = SMSLoginProvider
