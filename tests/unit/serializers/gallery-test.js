import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | gallery', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('gallery');

    assert.ok(serializer);
  });

  test('it serializes records', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('gallery', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it makes gallery slides easier to work with', function(assert) {
    let store = this.owner.lookup('service:store');
    let GalleryClass = store.modelFor('gallery');
    let serializer = store.serializerFor('gallery');

    const PAYLOAD = {
      slides: [{
        type: "image_slide",
        value: {
          slide_title: "test 1",
          slide_image: {
            image: {
              id: 1,
              caption: "Original caption",
            },
            caption: "A caption override"
          }
        },
        id: "80227d59-6dce-4482-baeb-39ce83905668"
      },
      {
        type: "image_slide",
        value: {
          slide_title: "slide 2",
          slide_image: {
            image: {
              id: 1287,
              caption: '',
            },
            caption: "image of blackout"
          }
        },
        id: "58fdab95-4210-4348-a84c-2d1a83709582"
      }]
    };

    let normalized = serializer.normalize(GalleryClass, PAYLOAD);

    assert.deepEqual(normalized.data.attributes.slides, [{
      title: 'test 1',
      caption: 'A caption override',
      image: {
        id: 1,
        caption: "Original caption",
      }
    }, {
      title: 'slide 2',
      caption: 'image of blackout',
      image: {
        id: 1287,
        caption: '',
      }
    }]);
  })
});
