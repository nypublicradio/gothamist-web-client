import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | application', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:application');
    assert.ok(adapter);
  });

  test('ajaxOptions should not add a query string if there are no params', function(assert) {
    let adapter = this.owner.lookup('adapter:application');
    const ajaxOptions = adapter.ajaxOptions('http://foo.com', 'GET', {data: {}});

    assert.notOk(ajaxOptions.url.endsWith('?'), 'should not have a query string');
  });

  test('ajaxOptions should add a key multiple times if the value is an array', function(assert) {
    let adapter = this.owner.lookup('adapter:application');
    const { url } = adapter.ajaxOptions('http://foo.com', 'GET', {data: {foo: ['bar', 'baz']}});

    assert.equal(url.split('?')[1], 'foo=bar&foo=baz');
  });
});
