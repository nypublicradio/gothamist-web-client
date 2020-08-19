import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | generic-subpath', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:generic-subpath');
    assert.ok(route);
  });
});
