'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');

const blinkmrcMock = require('../helpers/blinkmrc.js');
const awsMock = require('../helpers/aws-sdk.js');
const requestMock = require('../helpers/request.js');

const TEST_SUBJECT = '../../lib/aws/assume-role.js';

const ACCESS_KEY_ID = 'valid access key id';
const SECRET_ACCESS_KEY = 'valid secret access key';
const SESSION_TOKEN = 'valid session token';
const JWT = 'a valid jwt';
const PROFILE = {
  name: 'FirstName LastName',
  awsRoles: {
    cliRole: 'valid aws role ARN'
  }
};
const getRoleParams = (profile) => {
  return {
    RoleArn: profile.awsRoles.cliRole,
    RoleSessionName: `Temp-CLI-User-${profile.name}`
  };
};

test.beforeEach((t) => {
  t.context.blinkmrc = blinkmrcMock(() => {
    return Promise.resolve({accessToken: JWT});
  });

  t.context.AWS = awsMock((roleParams, callback) => {
    callback(null, {
      Credentials: {
        AccessKeyId: ACCESS_KEY_ID,
        SecretAccessKey: SECRET_ACCESS_KEY,
        SessionToken: SESSION_TOKEN
      }
    });
  });

  t.context.request = requestMock((url, data, callback) => {
    callback(null, {}, PROFILE);
  });

  t.context.getAWSRoleParams = (profile, callback) => {
    callback(null, getRoleParams(profile));
  };

  t.context.clientName = 'Client Name';
});

test.cb('assumeRole() should return valid aws credentials', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': t.context.request,
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .then((assumedRole) => {
      t.deepEqual(assumedRole, {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
        sessionToken: SESSION_TOKEN
      });
      t.end();
    })
    .catch(() => {
      t.fail();
      t.end();
    });
});

test.cb('assumeRole() should call blinkmrc to get access token with clientName', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': t.context.request,
    '@blinkmobile/blinkmrc': blinkmrcMock((options) => {
      t.is(options.name, t.context.clientName);
      t.end();
      return Promise.resolve({accessToken: JWT});
    })
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .catch(() => {
      t.fail();
      t.end();
    });
});

test.cb('assumeRole() should reject if a jwt is not found from blinkmrc', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': t.context.request,
    '@blinkmobile/blinkmrc': blinkmrcMock(() => {
      return Promise.resolve({});
    })
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .then(() => {
      t.fail();
      t.end();
    })
    .catch((error) => {
      t.is('Unauthenicated, please use the login command to login.', error);
      t.end();
    });
});

test.cb('assumeRole() should call request with the jwt token returned from blinkmrc', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': requestMock((url, data, callback) => {
      t.is(data.json.id_token, JWT);
      t.end();
      callback(null, {}, PROFILE);
    }),
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .catch(() => {
      t.fail();
      t.end();
    });
});

test.cb('assumeRole() should reject if a request returns an error', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': requestMock((url, data, callback) => {
      callback('Test error message');
    }),
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .then(() => {
      t.fail();
      t.end();
    })
    .catch((error) => {
      t.is('Test error message', error);
      t.end();
    });
});

test.cb('assumeRole() should reject if a request returns \'Unauthorized\'', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': requestMock((url, data, callback) => {
      callback(null, {}, 'Unauthorized');
    }),
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .then(() => {
      t.fail();
      t.end();
    })
    .catch((error) => {
      t.is('Unauthorized, your access token may have expired. Please use the login command to login again.', error);
      t.end();
    });
});

test.cb('assumeRole() should call getAWSRoleParams with the profile returned from request', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': t.context.request,
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, (profile, callback) => {
    t.deepEqual(profile, PROFILE);
    t.end();
    callback(null, {
      RoleArn: profile.awsRoles.cliRole,
      RoleSessionName: `Temp-CLI-User-${profile.name}`
    });
  })
  .catch(() => {
    t.fail();
    t.end();
  });
});

test.cb('assumeRole() should reject if a getAWSRoleParams returns an error', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': t.context.AWS,
    'request': t.context.request,
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, (profile, callback) => {
    callback('test error message');
  })
  .then(() => {
    t.fail();
    t.end();
  })
  .catch((error) => {
    t.is('test error message', error);
    t.end();
  });
});

test.cb('assumeRole() should call assumeRoleWithWebIdentity with the role params returned from getAWSRoleParams', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': awsMock((roleParams, callback) => {
      const testRoleParams = getRoleParams(PROFILE);
      testRoleParams.WebIdentityToken = JWT;
      testRoleParams.RoleSessionName = testRoleParams.RoleSessionName.replace(/\s+/g, '-');
      t.deepEqual(roleParams, testRoleParams);
      t.end();
      callback(null, {
        Credentials: {
          AccessKeyId: ACCESS_KEY_ID,
          SecretAccessKey: SECRET_ACCESS_KEY,
          SessionToken: SESSION_TOKEN
        }
      });
    }),
    'request': t.context.request,
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .catch((error) => {
      t.is('test error message', error);
      t.end();
    });
});

test.cb('assumeRole() should reject if assumeRoleWithWebIdentity returns an error', (t) => {
  const assumeRole = proxyquire(TEST_SUBJECT, {
    'aws-sdk': awsMock((roleParams, callback) => {
      callback('test error message');
    }),
    'request': t.context.request,
    '@blinkmobile/blinkmrc': t.context.blinkmrc
  });

  assumeRole(t.context.clientName, t.context.getAWSRoleParams)
    .then(() => {
      t.fail();
      t.end();
    })
    .catch((error) => {
      t.is('test error message', error);
      t.end();
    });
});
