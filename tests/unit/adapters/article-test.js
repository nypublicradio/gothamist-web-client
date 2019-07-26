import DS from 'ember-data';

import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

import { DEFAULT_QUERY_PARAMS } from 'gothamist-web-client/adapters/article';

module('Unit | Adapter | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:article');
    assert.ok(adapter);
  });

  test('ajaxOptions adds the expected params', function(assert) {
    const URL = 'https://example.com';
    const QP = {slug: 'foo'};

    const EXPECTED = Object.entries({
      ...DEFAULT_QUERY_PARAMS,
      ...QP,
    }).map(([key, val]) => `${key}=${val}`).join('&');

    let adapter = this.owner.lookup('adapter:article');

    const ajaxOptions = adapter.ajaxOptions(URL, 'GET', {data: QP});

    assert.equal(ajaxOptions.url, `${URL}?${EXPECTED}`);
  });

  test('query does not throw a 404 if items is empty', async function(assert) {
    let store = this.owner.lookup('service:store');
    let adapter = this.owner.lookup('adapter:article');

    this.stub(adapter, 'ajax')
      .resolves({items: []});

    await adapter.query(store, store.modelFor('article'), {});
    assert.ok('no error thrown');
  });

  test('queryRecord throws if html_path is not included', function(assert) {
    let store = this.owner.lookup('service:store');
    let adapter = this.owner.lookup('adapter:article');

    try {
      adapter.queryRecord(store, store.modelFor('article'), {});
    } catch(e) {
      assert.ok('adapter should throw');
      assert.equal(e.message, 'html_path is a required argument');
    }
  });
});
