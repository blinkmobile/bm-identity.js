# bm-identity.js [![npm](https://img.shields.io/npm/v/@blinkmobile/bm-identity.svg?maxAge=2592000)](https://www.npmjs.com/package/@blinkmobile/bm-identity) [![AppVeyor Status](https://ci.appveyor.com/api/projects/status/github/blinkmobile/bm-identity.js?branch=master&svg=true)](https://ci.appveyor.com/project/blinkmobile/bm-identity-js) [![Travis CI Status](https://travis-ci.org/blinkmobile/bm-identity.js.svg?branch=master)](https://travis-ci.org/blinkmobile/bm-identity.js)

Provides easy management of authenication for our CLI via a single identity.

## Getting Started

```sh
npm install @blinkmobile/bm-identity --save
```

```js
const pkg = require('./package.json');
const BlinkMobileIdentity = require('@blinkmobile/bm-identity');
const blinkMobileIdentity = new BlinkMobileIdentity(pkg.name);
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
  email? : String|Boolean, // Can also pass true to be prompted for email address
  sms? : String|Boolean, // Can also pass true to be prompted for phone number
}
```

```js
blinkMobileIdentity.login()
  .then(jwt => {
    // Use jwt access token.
  });
```

### Logout

```js
logout () => Promise
```

```js
blinkMobileIdentity.logout();
```

### Assume AWS Role

```js
assumeAWSRole (additionalParameters: Object) => Promise{AssumedRoleCredentials}
```

```js
interface AssumedRoleCredentials {
  accessKeyId : String,
  secretAccessKey : String,
  sessionToken : String
}
```

```js
blinkMobileIdentity.assumeAWSRole()
  .then(credentials => {
    // Use AWS credentials
  });
```

### Get Profile

```js
getProfile () => Promise{Auth0Profile}
```

```js
blinkMobileIdentity.getProfile()
  .then(profile => {
    // Use Auth0 profile
  });
```

```js
getAccessToken () => Promise{string}
```

```js
blinkMobileIdentity.getAccessToken()
  .then(jwt => {
    // Use access token
  });
```

See [Auth0 Profile Structure](https://auth0.com/docs/user-profile/user-profile-structure) for available properties.

### Manage Tenants

Get and set the current tenant. Also get and remove list of previously used tenants.

```js
getTenants () => Promise{Tenants}
```

```js
setTenant (tenantName: String) => Promise{Tenants}
```

```js
removeTenant (tenantName: String) => Promise{Tenants}
```

```js
interface Tenants {
  current : String,
  previous : Array{String}
}
```

```js
blinkMobileIdentity.getTenants()
  .then(tenants => {
    // Use tenants
  });

blinkMobileIdentity.setTenant('TenantName')
  .then(tenants => {
    // Tenant was set
  });

blinkMobileIdentity.removeTenant('TenantName')
  .then(tenants => {
    // Tenant was removed
  });
```
