# Change Log

## Unreleased

### Added

- `tenant` argument to constructor

## 5.0.0 - 2019-03-05

### Changed

- changed from Auth0 to Cognito

### Removed

- the following functions:
  - `assumeAWSRole()`
  - `getTenants()`
  - `setTenant()`
  - `removeTenant()`

### Dependencies

- update [base64url](https://www.npmjs.com/package/base64url) to 3.0.1 (from 2.0.0)

- update [inquirer](https://www.npmjs.com/package/inquirer) to 6.2.2 (from [5.1.0](https://github.com/SBoudrias/Inquirer.js/releases/tag/v5.1.0))

- update [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to [8.5.0](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md) (from [8.1.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md))

- no longer depend upon [lodash.memoize](https://www.npmjs.com/package/lodash.memoize)

- update [opn](https://www.npmjs.com/package/opn) to 5.4.0 (from 5.2.0)

- update [request](https://www.npmjs.com/package/request) to [2.88.0](https://github.com/request/request/blob/master/CHANGELOG.md) (from [2.83.0](https://github.com/request/request/blob/master/CHANGELOG.md))

- depend upon [aws-sdk](https://www.npmjs.com/package/aws-sdk) [2.412.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.412.0)

## 4.0.2 - 2018-07-20

### Dependencies

- update [@blinkmobile/blinkmrc](https://www.npmjs.com/package/@blinkmobile/blinkmrc) to [2.0.0](https://github.com/blinkmobile/blinkmrc.js/releases/tag/2.0.0) (from [1.1.0](https://github.com/blinkmobile/blinkmrc.js/releases/tag/1.1.0))

- update [inquirer](https://www.npmjs.com/package/inquirer) to [5.1.0](https://github.com/SBoudrias/Inquirer.js/releases/tag/v5.1.0) (from [5.0.1](https://github.com/SBoudrias/Inquirer.js/releases/tag/v5.0.1))

## 4.0.1 - 2018-02-02

### Fixed

- usage of `accessToken` as well as `id_token` to be backward compatible

## 4.0.0 - 2018-02-01

### Added

- `refreshToken` option to `login()` function

### Removed

- `getProfile()` function
- `email` login provider
- `sms` login provider

## 3.3.0 - 2018-01-24

### Added

- `getPayload` function for getting Access Token payload

## 3.2.0 - 2018-01-10

### Added

- API-116: check for environment variables to use to create JWT instead of checking local file system.

### Dependencies

- update [inquirer](https://www.npmjs.com/package/inquirer) to [5.0.0](https://github.com/SBoudrias/Inquirer.js/releases/tag/v5.0.0) (from [3.3.0](https://github.com/SBoudrias/Inquirer.js/releases/tag/v3.3.0))

## 3.1.0 - 2017-10-19

### Added

- `email` scope to requests to get Access Tokens from Auth0

### Dependencies

- update [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to [8.1.0](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md) (from [8.0.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md))

- update [request](https://www.npmjs.com/package/request) to [2.83.0](https://github.com/request/request/blob/master/CHANGELOG.md) (from [2.82.0](https://github.com/request/request/blob/master/CHANGELOG.md))

## 3.0.0 - 2017-09-22

### Breaking Changes

- ANALYTICS-125: Added login option `storeJwt` to store jwt on local file system. **This property will default to `false`**. This was the default behaviour in previous releases.
- AUTH-84: promise return from `getAccessToken()` will now reject if:
  - There is no access token stored on the local file system
  - The access token stored is not a valid JWT
  - The access token stored has expired

### Removed

- AUTH-84: `getServiceSettings()` function

### Dependencies

- no longer depend upon [aws-sdk](https://www.npmjs.com/package/aws-sdk)

- update [inquirer](https://www.npmjs.com/package/inquirer) to [3.3.0](https://github.com/SBoudrias/Inquirer.js/releases/tag/v3.3.0) (from [3.0.6](https://github.com/SBoudrias/Inquirer.js/releases/tag/v3.0.6))

- update [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to [8.0.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md) (from [7.4.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md))

- update [opn](https://www.npmjs.com/package/opn) to 5.1.0 (from 5.0.0)

- update [request](https://www.npmjs.com/package/request) to [2.82.0](https://github.com/request/request/blob/master/CHANGELOG.md) (from [2.81.0](https://github.com/request/request/blob/master/CHANGELOG.md))

## 2.3.5 - 2017-05-29

### Dependencies

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.58.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.58.0) (from [2.33.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.33.0))

- update [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to [7.4.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md) (from [7.3.0](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md))

- update [opn](https://www.npmjs.com/package/opn) to 5.0.0 (from 4.0.2)

## 2.3.4 - 2017-03-28

### Added

- AUTH-29: verification of jwt before requesting service settings

### Dependencies

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.33.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.33.0) (from [2.22.0](https://github.c
  om/aws/aws-sdk-js/releases/tag/v2.22.0))

- update [inquirer](https://www.npmjs.com/package/inquirer) to [3.0.6](https://github.com/SBoudrias/Inquirer.js/releases/tag/v3.0.6) (from [3.0.5](https://gi
  thub.com/SBoudrias/Inquirer.js/releases/tag/v3.0.5))

- update [request](https://www.npmjs.com/package/request) to [2.81.0](https://github.com/request/request/blob/master/CHANGELOG.md) (from [2.79.0](https://git
  hub.com/request/request/blob/master/CHANGELOG.md))

## 2.3.3 - 2017-03-02

### Fixed

- AUTH-24: config store being created when file is loaded

### Dependencies

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.22.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.22.0) (from [2.11.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.11.0))

- update [inquirer](https://www.npmjs.com/package/inquirer) to [3.0.5](https://github.com/SBoudrias/Inquirer.js/releases/tag/v3.0.5) (from [3.0.1](https://github.com/SBoudrias/Inquirer.js/releases/tag/v3.0.1))

- update [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to [7.3.0](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md) (from [7.2.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md))

## 2.3.2 - 2017-02-28

### Changed

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.11.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.11.0) (from [2.7.21](https://github.com/aws/aws-sdk-js/releases/tag/v2.7.21))

- update [inquirer](https://www.npmjs.com/package/inquirer) to [3.0.1](https://github.com/SBoudrias/Inquirer.js/releases/tag/v3.0.1) (from [2.0.0](https://github.com/SBoudrias/Inquirer.js/releases/tag/v2.0.0))

## 2.3.1 - 2017-01-16

### Fixed

- AUTH-16: Querystring passed to opn is now correctly escaped (@simonmarklar)

## 2.3.0 - 2016-12-01

### Added

- AUTH-15: Support for passing additional parameters when requesting service settings

### dependencies

- `aws-sdk`: `2.6.15` -> `2.7.9`
- `inquirer`: `1.2.2` -> `1.2.3`
- `request`: `2.78.0` -> `2.79.0`

### devDependencies

- `eslint`: `^3.9.1` -> `^3.11.1`
- `flow-bin`: `^0.34.0` -> `^0.35.0`

## 2.2.0 - 2016-11-08

### Added

- AUTH-14: Ability to get access token stored after a successful login.

- AUTH-14: Ability to get Auth0 profile using an access token.

- AUTH-14: Ability to get settings scoped to a BlinkMobile service.

### Changed

- AUTH-14: Updated all dependencies.

## 2.1.0 - 2016-09-13

### Fixed

- AUTH-9: Fixed issues with Node 4 support

### Added

- AUTH-8: Sliding Sessions
  - Access tokens issued after a successful login will now be exchanged for new access tokens when they are used.
  - An access token will only be exchanged if it is close to expiring.

### Changed

- AUTH-8: Error handling to use `Error`s instead of string literals.

## 2.0.0 - 2016-09-08

### Added

- AUTH-7: Management of tenants

### Removed

- AUTH-7: Functionality to extend existing CLI tools with `bm <service> login` and `bm <service> logout` commands
