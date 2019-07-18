import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('article');

    assert.ok(serializer);
  });

  test('it serializes records', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('article', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it converts lead_asset to an object', function(assert) {
    let store = this.owner.lookup('service:store');
    let ArticleClass = store.modelFor('article');
    let serializer = store.serializerFor('article');

    const EXPECTED = 'lead asset value';

    let normalized = serializer.normalize(ArticleClass, {lead_asset: [EXPECTED]});

    assert.deepEqual(normalized.data.attributes.leadAsset, EXPECTED);
  })

});
