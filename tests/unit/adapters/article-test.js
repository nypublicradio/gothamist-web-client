import DS from 'ember-data';

import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Adapter | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:article');
    assert.ok(adapter);
  });

  test('queryRecord throws a 404 is entries is empty', async function(assert) {
    let store = this.owner.lookup('service:store');
    let adapter = this.owner.lookup('adapter:article');

    this.stub(adapter, 'ajax')
      .resolves({entries: []});

    try {
      await adapter.queryRecord(store, store.modelFor('article'), {});
    } catch(e) {
      assert.ok(e instanceof DS.NotFoundError);
    }
  });

  test('query does not throw a 404 if entries is empty', async function(assert) {
    let store = this.owner.lookup('service:store');
    let adapter = this.owner.lookup('adapter:article');

    this.stub(adapter, 'ajax')
      .resolves({entries: []});

    await adapter.query(store, store.modelFor('article'), {});
    assert.ok('no error thrown');
  });

  test('ajaxOptions forms query parameters according to MT requirements', function(assert) {
    let adapter = this.owner.lookup('adapter:article');

    const URL = 'http://example.com';
    let queryParams = {
      foo: 'bar',
      biz: 'qux'
    };

    let options = adapter.ajaxOptions(URL, 'GET', {data: queryParams});
    assert.equal(options.url, `${URL}?foo=bar&biz=qux`);

    queryParams = {
      foo: 'bar',
      biz: ['qux', 'cats & dogs']
    };

    options = adapter.ajaxOptions(URL, 'GET', {data: queryParams});
    assert.equal(options.url, `${URL}?foo=bar&biz=qux&biz=cats%20%26%20dogs`);
  })
});
