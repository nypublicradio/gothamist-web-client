import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { Response } from 'ember-cli-mirage';

import config from 'gothamist-web-client/config/environment';

module('Acceptance | gallery', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;
  });

  hooks.afterEach(() => {
    window.block_disqus = false;
  })

  test('gallery should contain 2 slides and 0 ads', async function(assert) {
    const gallery = server.create('gallery', {section: 'food', count: 2});

    await visit(`/food/galleries/${gallery.slug}`);

    // do a match to guard against non-determinism with ?image query string
    assert.ok(currentURL().match(`/food/photos/${gallery.slug}`), 'path should include gallery');
    assert.dom('[data-test-gallery-slide]').exists({count: 2});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 0});
  });

  test('gallery should contain 3 slides and 1 ad', async function(assert) {
    const article = server.create('article', 'mtGallery', {_section: 'food'});
    // 7 articles - 4 = 3
    article.gallery_array.splice(0, 4);
    article.gallery_captions.splice(0, 4);
    article.gallery_full.splice(0, 4);

    await visit(`/${article.path}/gallery`);

    assert.equal(currentURL(), `/${article.path}/gallery`);
    assert.dom('[data-test-gallery-slide]').exists({count: 3});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 1});
  });

  test('gallery should contain 5 slides and 1 ads', async function(assert) {
    const article = server.create('article', 'mtGallery', {_section: 'food'});
    // 7 articles - 2 = 6
    article.gallery_array.splice(0, 2)
    article.gallery_captions.splice(0, 2)
    article.gallery_full.splice(0, 2)

    await visit(`/${article.path}/gallery`);

    assert.equal(currentURL(), `/${article.path}/gallery`);
    assert.dom('[data-test-gallery-slide]').exists({count: 5});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 1});
  });


  test('gallery should contain 6 slides and 2 ads', async function(assert) {
    const article = server.create('article', 'mtGallery', {_section: 'food'});
    // 7 articles - 1 = 6
    article.gallery_array.splice(0, 1)
    article.gallery_captions.splice(0, 1)
    article.gallery_full.splice(0, 1)

    await visit(`/${article.path}/gallery`);

    assert.equal(currentURL(), `/${article.path}/gallery`);
    assert.dom('[data-test-gallery-slide]').exists({count: 6});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 2});
  });

  test('gallery should contain 14 slides and still only 2 ads', async function(assert) {
    const article = server.create('article', 'mtGallery', {_section: 'food'});
    // 7 articles + 7 = 14
    article.gallery_array.push(...article.gallery_array);
    article.gallery_captions.push(...article.gallery_captions);
    article.gallery_full.push(...article.gallery_full);

    await visit(`/${article.path}/gallery`);

    assert.equal(currentURL(), `/${article.path}/gallery`);
    assert.dom('[data-test-gallery-slide]').exists({count: 14});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 2});
  });

  test('navigating to a gallery that returns a 500 should still load the article', async function(assert) {
    server.create('article', 'platypusGallery', {path: 'foo', id: '1'});
    server.get(`${config.apiServer}/platypus/api/gallery/:gallery`, new Response(500));

    await visit('/');

    await click('[data-test-block="1"] a');

    assert.equal(currentURL(), '/foo');
  });
});
