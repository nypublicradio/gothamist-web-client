import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | newsletter', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:newsletter');
    assert.ok(route);
  });
});
