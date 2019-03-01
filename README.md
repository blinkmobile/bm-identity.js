# bm-identity.js [![npm](https://img.shields.io/npm/v/@blinkmobile/bm-identity.svg?maxAge=2592000)](https://www.npmjs.com/package/@blinkmobile/bm-identity) [![AppVeyor Status](https://img.shields.io/appveyor/ci/blinkmobile/bm-identity-js/master.svg)](https://ci.appveyor.com/project/blinkmobile/bm-identity-js) [![Travis CI Status](https://travis-ci.org/blinkmobile/bm-identity.js.svg?branch=master)](https://travis-ci.org/blinkmobile/bm-identity.js) [![Greenkeeper badge](https://badges.greenkeeper.io/blinkmobile/bm-identity.js.svg)](https://greenkeeper.io/)

Provides easy management of authenication for our CLI via a single identity.

## Getting Started

```sh
npm install @blinkmobile/bm-identity --save
```

```js
const BlinkMobileIdentity = require('@blinkmobile/bm-identity');
const blinkMobileIdentity = new BlinkMobileIdentity();
```

## Usage

### Login

If no LoginOptions are passed, a browser based login process will start. This is how users can login using a social account e.g. Google.

```js
login (options: LoginOptions) => Promise{String}
```

```js
interface LoginOptions {
  username? : String|Boolean, // Can also pass true, and username will be prompted for
  password? : String, // Will be prompted for password if username is truthy
  storeJwt? : Boolean, // Set to true to store jwt on local file system, defaults to false
  refreshToken? : Boolean, // Set to true will request a refresh token as well as an access token
}
```

```js
blinkMobileIdentity.login()
  .then(jwt => {
    // Use jwt access token.
  });
```

#### `storeJwt` Option

-   If set to `true`, will use [@blinkmobile/blinkmrc User Config](https://www.npmjs.com/package/@blinkmobile/blinkmrc) to store on local file system for later use.

### Logout

```js
logout () => Promise
```

```js
blinkMobileIdentity.logout();
```

### Get Access Token

To create an `AccessToken` using BlinkM Deployment Keys or retrieve the `AccessToken` stored after a successful login:

#### Using Deployment Keys

If the following environment variables are set:

-   `BLINKM_ACCESS_KEY`
-   `BLINKM_SECRET_KEY`

These will be used to create an `AccessToken`

```js
getAccessToken () => Promise{string}
```

```js
blinkMobileIdentity.getAccessToken()
  .then(jwt => {
    // Use access token
  });
```

### Get Access Token Payload

Helper function to get the payload for a JWT

```js
getPayload () => Promise{Object}
```

```js
blinkMobileIdentity.getPayload()
  .then(payload => {
    // Use payload
  });
```
