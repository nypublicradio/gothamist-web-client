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
    const FAKE_PAYLOAD = {
      body: [], // serializer expects this
      lead_asset: [EXPECTED],
    }

    let normalized = serializer.normalize(ArticleClass, FAKE_PAYLOAD);

    assert.deepEqual(normalized.data.attributes.leadAsset, EXPECTED);
  });

  test('it dasherizes the `type` key of body blocks', function(assert) {
    let store = this.owner.lookup('service:store');
    let ArticleClass = store.modelFor('article');
    let serializer = store.serializerFor('article');

    const EXPECTED = 'social-embed';
    const FAKE_PAYLOAD = {
      body: [{
        type: 'social_embed'
      }],
    };

    let normalized = serializer.normalize(ArticleClass, FAKE_PAYLOAD);

    assert.equal(
      normalized.data.attributes.body[0].type,
      EXPECTED,
    );

  })

});
