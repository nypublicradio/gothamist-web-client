import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from 'gothamist-web-client/models/article';

module('Unit | Serializer | page', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('page');

    assert.ok(serializer);
  });

  test('it serializes records', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('page', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it normalizes query repsonses to support polymorphic models', function(assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('page');
    const PageModel = store.modelFor('page');

    const SEARCH_RESPONSE = id => ({
      id,
      content_type_id: 100,
      score: 2.3456,
      result: {
        meta: {
          type: ARTICLE_TYPE, // this is required to support polymorphism
        },
        show_as_feature: true, // test camelCase
        title: 'Foo',
      }
    });

    const PAYLOAD = {
      items: [],
      meta: {
        total_count: 10,
      }
    };

    for (let i = 0; i < 10; i++) {
      PAYLOAD.items.push(SEARCH_RESPONSE(i + 1));
    }

    const output = serializer.normalizeQueryResponse(store, PageModel, PAYLOAD, null, 'query');

    assert.equal(output.data.length, 10);
    assert.deepEqual(output.data.mapBy('type'), new Array(10).fill('article'), 'page serializer produces JSON API article objects');
    assert.ok(output.data[0].attributes.showAsFeature, 'key names are camelCased')
  });
});
