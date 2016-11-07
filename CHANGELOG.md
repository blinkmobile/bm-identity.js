# Change Log

## Unreleased

### Added

- AUTH-14: Ability to get access token stored after a succesful login.

- AUTH-14: Ability to get Auth0 profile using an access token.

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
