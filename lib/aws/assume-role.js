'use strict';

/**
 * Module for assuming an AWS Role using a Blink Mobile identity.
 * @module aws/assume-role
 */

const AWS = require('aws-sdk');
const request = require('request');
const blinkmrc = require('@blinkmobile/blinkmrc');

const constants = require('../constants.js');

/**
 * Get JWT generated after a successful login
 * @function getJwt
 * @private
 * @param {String} clientName - The name of a Client.
 * @returns {String} The JWT generated after a successful login.
 */
function getJwt (clientName) {
  const userConfigStore = blinkmrc.userConfig({ name: clientName });
  return userConfigStore.load().then(config => config.accessToken);
}

/**
 * Assume an temporary AWS role's credentials.
 * @function assumeRole
 * @param {String} clientName - The name of a Client.
 * @param {BlinkMobileIdentity~getAWSRoleParams} getAWSRoleParams - A function that gets the AWS roles params.
 * @returns {Object} The AWS credentials.
 */
function assumeRole (clientName, getAWSRoleParams) {
  return getJwt(clientName).then((jwt) => {
    return new Promise((resolve, reject) => {
      if (!jwt) {
        reject('Unauthenicated, please use the login command to login.');
        return;
      }

      request.post(constants.AUTH0_URL + '/tokeninfo', {
        json: {
          id_token: jwt
        }
      }, (err, status, profile) => {
        if (err) {
          reject(err);
          return;
        }

        if (profile === 'Unauthorized') {
          reject('Unauthorized, your access token may have expired. Please use the login command to login again.');
          return;
        }

        getAWSRoleParams(profile, (err, roleParams) => {
          if (err) {
            reject(err);
            return;
          }

          roleParams.WebIdentityToken = jwt;
          // RoleSessionName can not have any spaces,
          // we will replace them with dashes
          roleParams.RoleSessionName = (roleParams.RoleSessionName || 'Temp-WebIdentity-User').replace(/\s+/g, '-');
          const STS = new AWS.STS();
          STS.assumeRoleWithWebIdentity(roleParams, (err, data) => {
            if (err) {
              reject(err);
              return;
            }

            resolve({
              accessKeyId: data.Credentials.AccessKeyId,
              secretAccessKey: data.Credentials.SecretAccessKey,
              sessionToken: data.Credentials.SessionToken
            });
          });
        });
      });
    });
  });
}

module.exports = assumeRole;
