import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | sitewide component', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('sitewide-components');

    assert.ok(serializer);
  });

  test('it normalizes the response', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('sitewide-components');

    let payload = {
      id: 1,
      meta: {
        type: "sitewide.SiteWideComponents",
        detail_url: "http://localhost/api/v2/sitewide_components/1/"
      },
      breaking_news: []
    };

    let expected = {
      data: {
        id: 1,
        type: 'sitewide-components',
        relationships: {
          breakingNews: {
            data: []
          }
        }
      },
      included: []
    };

    let normalizedJSON = serializer.normalizeFindRecordResponse(store, 'systemMessages', payload, payload.id);
    assert.deepEqual(normalizedJSON, expected);
  });

  test('it normalizes responses with breaking-news', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('sitewide-components');

    let payload = {
      id: 1,
      meta: {
        type: "sitewide.SiteWideComponents",
        detail_url: "http://localhost/api/v2/sitewide_components/1/"
      },
      breaking_news: [{
        type: "breaking_news",
        value: {
          title:"Test Title",
          link: "http://example.com",
          description: "<p>Test Description</p>",
          start_time: "2019-05-02T22:07:31.764000Z"
        },
        id: "1234-abcd",
      }]
    };

    let expected = {
      data: {
        id: 1,
        type: 'sitewide-components',
        relationships: {
          breakingNews: {
            data: [
               {id: "1234-abcd", type: "breaking-news"}
            ]
          }
        }
      },
      included: [{
        id: "1234-abcd",
        type: "breaking-news",
        attributes: {
          title:"Test Title",
          link: "http://example.com",
          description: "<p>Test Description</p>",
          startTime: "2019-05-02T22:07:31.764000Z",
        }
      }]
    };

    let normalizedJSON = serializer.normalizeFindRecordResponse(store, 'systemMessages', payload, payload.id);
    assert.deepEqual(normalizedJSON, expected);
  });
});
