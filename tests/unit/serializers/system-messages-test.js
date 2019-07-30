import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | system messages', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('system-messages');

    assert.ok(serializer);
  });

  test('it normalizes the response', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('systemMessages');

    let payload = {
      id: 1,
      meta: {
        type: "utils.SystemMessagesSettings",
        detail_url: "http://localhost/api/v2/system_messages/1/"
      },
      value: {
        product_banners: []
      }
    };

    let expected = {
      data: {
        id: 1,
        type: 'system-messages',
        relationships: {
          productBanners: {
            data: []
          }
        }
      },
      included: []
    };

    let normalizedJSON = serializer.normalizeFindRecordResponse(store, 'systemMessages', payload, payload.id);
    assert.deepEqual(normalizedJSON, expected);
  });

  test('it normalizes responses with product-banners', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('systemMessages');

    let payload = {
      id: 1,
      meta: {
        type: "utils.SystemMessagesSettings",
        detail_url: "http://localhost/api/v2/system_messages/1/"
      },
      product_banners: [{
        type: "product_banner",
        value: {
          title:"Test Title",
          description: "<p>Test Description</p>",
          button_text: "Test Button",
          button_link: "http://example.com",
          frequency: 8,
          location: "TOP",
        },
        id: "1234-abcd",
      }]
    };

    let expected = {
      data: {
        id: 1,
        type: 'system-messages',
        relationships: {
          productBanners: {
            data: [
              {id: "1234-abcd", type: "product-banner"}
            ]
          }
        }
      },
      included: [{
        id: "1234-abcd",
        type: "product-banner",
        attributes: {
          title:"Test Title",
          description: "<p>Test Description</p>",
          buttonText: "Test Button",
          buttonLink: "http://example.com",
          frequency: 8,
          location: "TOP",
        }
      }]
    };

    let normalizedJSON = serializer.normalizeFindRecordResponse(store, 'systemMessages', payload, payload.id);
    assert.deepEqual(normalizedJSON, expected);

  });

});
