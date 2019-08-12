import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Adapter | page', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:page');
    assert.ok(adapter);
  });

  test('it uses the expected URL for query', function() {
    const store = this.owner.lookup('service:store');
    const PageModel = store.modelFor('page');
    const adapter = this.owner.lookup('adapter:page');
    const QUERY = 'foo';

    const ajaxMock = this.mock()
      .once()
      .withArgs(`${adapter.host}/${adapter.namespace}/search/`, 'GET', {data: {q: QUERY}});

    adapter.ajax = ajaxMock;

    adapter.query(null, PageModel, {q: QUERY});
  });

  test('it uses the expected URL for queryRcord', function() {
    const adapter = this.owner.lookup('adapter:page');
    const PATH = 'foo/bar';

    const ajaxMock = this.mock()
      .once()
      .withArgs(`${adapter.host}/${adapter.namespace}/${adapter.pathForType()}/find/?html_path=${PATH}`);

    adapter.ajax = ajaxMock;

    adapter.queryRecord(null, null, {html_path: PATH});
  });
});
