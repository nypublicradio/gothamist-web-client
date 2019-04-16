import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | gallery', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('gallery', {});
    assert.ok(model);
  });
});
