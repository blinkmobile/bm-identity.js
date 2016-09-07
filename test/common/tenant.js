'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');

const userConfigStoreMock = require('../helpers/user-config.js');

const TEST_SUBJECT = '../../lib/common/tenant.js';

const TENANT_NAME = 'valid tenant name';
const TENANTS = {
  current: TENANT_NAME,
  previous: [
    TENANT_NAME
  ]
};
const loadFn = () => {
  return Promise.resolve({
    tenants: TENANTS
  });
};
const userConfigUpdateFn = (updateFn) => {
  // Need a new instance of the object every test
  return Promise.resolve(updateFn({
    tenants: {
      current: TENANT_NAME,
      previous: [
        TENANT_NAME
      ]
    }
  }));
};

test.beforeEach((t) => {
  t.context.userConfigStore = userConfigStoreMock(loadFn, userConfigUpdateFn);
});

test.cb('get() should return tenants', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.get()
    .then((tenants) => {
      t.deepEqual(tenants, TENANTS);
      t.end();
    })
    .catch((error) => {
      t.fail(error);
      t.end();
    });
});

test.cb('get() should call load() to get tenants', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': userConfigStoreMock(() => {
      t.pass();
      t.end();
      return Promise.resolve({});
    })
  });

  tenant.get()
    .catch((error) => {
      t.fail(error);
      t.end();
    });
});

test.cb('set() should return tenants', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.set(TENANT_NAME)
    .then((tenants) => {
      t.deepEqual(tenants, TENANTS);
      t.end();
    })
    .catch((error) => {
      t.fail(error);
      t.end();
    });
});

test.cb('set() should reject with error if no tenant name is passed in', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.set()
    .then(() => {
      t.fail();
      t.end();
    })
    .catch((error) => {
      t.deepEqual(error, new Error('Must specify a tenant to set'));
      t.end();
    });
});

test.cb('set() should call userConfigStore.update() to set the tenant name passed in to current', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.set('new tenant')
    .then((tenants) => {
      t.deepEqual(tenants, {
        current: 'new tenant',
        previous: [
          TENANT_NAME,
          'new tenant'
        ]
      });
      t.end();
    })
    .catch((error) => {
      t.fail(error);
      t.end();
    });
});

test.cb('set() should call userConfigStore.update() and should not add tenant to previous if already exists', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.set(TENANT_NAME)
    .then((tenants) => {
      t.deepEqual(tenants, {
        current: TENANT_NAME,
        previous: [
          TENANT_NAME
        ]
      });
      t.end();
    })
    .catch((error) => {
      t.fail(error);
      t.end();
    });
});

test.cb('remove() should reject with error if no tenant name is passed in', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.set()
    .then(() => {
      t.fail();
      t.end();
    })
    .catch((error) => {
      t.deepEqual(error, new Error('Must specify a tenant to remove'));
      t.end();
    });
});

test.cb('remove() should call userConfigStore.update() to remove the tenant name passed in to current', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.remove(TENANT_NAME)
    .then((tenants) => {
      t.deepEqual(tenants, {
        previous: []
      });
      t.end();
    })
    .catch((error) => {
      t.fail(error);
      t.end();
    });
});

test.cb('remove() should call userConfigStore.update() and should not remove tenant from previous if it does not exist', (t) => {
  const tenant = proxyquire(TEST_SUBJECT, {
    '../utils/user-config.js': t.context.userConfigStore
  });

  tenant.remove('new tenant')
    .then((tenants) => {
      t.deepEqual(tenants, {
        current: TENANT_NAME,
        previous: [
          TENANT_NAME
        ]
      });
      t.end();
    })
    .catch((error) => {
      t.fail(error);
      t.end();
    });
});
