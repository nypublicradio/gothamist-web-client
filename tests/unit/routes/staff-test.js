import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | staff', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:staff');
    assert.ok(route);
  });
});
