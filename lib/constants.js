/* @flow */
'use strict'

const constants = {
  TENANTS: {
    ONEBLINK: {
      AWS_REGION: 'ap-southeast-2',
      LOGIN_URL:
        process.env.BM_IDENTITY_LOGIN_URL || 'https://login.oneblink.io',
      LOGIN_CLIENT_ID:
        process.env.BM_IDENTITY_LOGIN_CLIENT_ID || '2f4qdgp88bemgp3r6cilo18af',
      LOGIN_CALLBACK_URL:
        process.env.BM_IDENTITY_LOGIN_CALLBACK_URL ||
        'https://console.oneblink.io/cli-tools-callback',
    },
    CIVICPLUS: {
      AWS_REGION: 'us-east-2',
      LOGIN_URL:
        process.env.BM_IDENTITY_LOGIN_URL ||
        'https://login.transform.civicplus.com',
      LOGIN_CLIENT_ID:
        process.env.BM_IDENTITY_LOGIN_CLIENT_ID || '1c7lusg15jm51l7gjn8e7ce0ti',
      LOGIN_CALLBACK_URL:
        process.env.BM_IDENTITY_LOGIN_CALLBACK_URL ||
        'https://console.transform.civicplus.com/cli-tools-callback',
    },
  },
  SCOPE: 'openid email',
}

module.exports = Object.freeze(constants)
