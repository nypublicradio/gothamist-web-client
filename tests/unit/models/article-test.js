import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { ANCESTRY } from '../fixtures/article-fixtures';
import {
  // LEAD_GALLERY,
  LEAD_VIDEO,
  LEAD_AUDIO,
  LEAD_IMAGE,
} from 'gothamist-web-client/models/article';


module('Unit | Model | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {});
    assert.ok(model);
  });

  // test computeds
  test('section is computed from ancestry', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {
      ancestry: ANCESTRY,
    });

    assert.deepEqual(model.section, {slug: 'news', title: 'News', id: 8});
  });

  test('thumbnail is properly computed', function(assert) {
    const EXPECTED = 'foo';
    const store = this.owner.lookup('service:store');

    let article = store.createRecord('article', {});
    assert.notOk(article.thumbnail, 'thumbnail should be undefined if there is no valid source');

    article = store.createRecord('article', {
      leadAsset: {
        type: LEAD_IMAGE,
        value: {
          image: EXPECTED,
        }
      }
    });
    assert.equal(article.thumbnail.id, EXPECTED, 'lead images are turned into thumbnails')

    article = store.createRecord('article', {
      leadAsset: {
        type: LEAD_AUDIO,
        value: {
          default_image: EXPECTED,
        }
      }
    });
    assert.equal(article.thumbnail.id, EXPECTED, 'lead audio images are turned into thumbnails')

    article = store.createRecord('article', {
      leadAsset: {
        type: LEAD_VIDEO,
        value: {
          default_image: EXPECTED,
        }
      }
    });
    assert.equal(article.thumbnail.id, EXPECTED, 'lead video images are turned into thumbnails')

    article = store.createRecord('article', {
      listingImage: {
        id: EXPECTED,
      }
    });
    assert.equal(article.thumbnail.id, EXPECTED, 'listingImage overrides everything else');
  })
});
