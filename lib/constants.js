/* @flow */
'use strict'

const constants = {
  LOGIN_URL: process.env.BM_IDENTITY_LOGIN_URL || 'https://login.oneblink.io',
  LOGIN_CLIENT_ID:
    process.env.BM_IDENTITY_LOGIN_CLIENT_ID || '2f4qdgp88bemgp3r6cilo18af',
  LOGIN_CALLBACK_URL:
    process.env.BM_IDENTITY_LOGIN_CALLBACK_URL ||
    'https://auth.blinkm.io/index.html',
  SCOPE: 'openid email',
}

module.exports = Object.freeze(constants)
