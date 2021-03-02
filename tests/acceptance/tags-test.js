import moment from 'moment';

import { module, test } from 'qunit';
import { visit, currentURL, click,findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';
import { COUNT } from 'gothamist-web-client/routes/tags';

module('Acceptance | tags', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /tags', async function(assert) {
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});
    await visit('/tags/dogs-and-cats');

    assert.equal(currentURL(), '/tags/dogs-and-cats');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-tag-heading]').hasText('dogs and cats');
    assert.dom('[data-test-section-label]').hasText('Food', 'section label is populated');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });

  test('tag lists get updated with commentCount', async function(assert) {
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs', name: 'dogs'}], tag_slug: 'dogs'});
    const EXPECTED = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/tags/dogs');

    await click('[data-test-more-results]');


    // assert that articles loaded via "read more" also get updated
    findAll('[data-test-block]').forEach(block => {
      let id = block.dataset.testBlock;
      let { uuid } = server.schema.articles.find(id);
      let { posts } = EXPECTED.find(d => d.identifiers.includes(uuid));
      assert.ok(block.querySelector('.c-block-meta__comments'), 'comments are rendered');
      assert.dom(block.querySelector('.c-block-meta__comments')).includesText(String(posts));
    });
  });

  test('breaking news on author route', async function(assert) {
    server.create('sitewide-component');
    server.create('breaking-news');

    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});
    await visit('/tags/dogs-and-cats');

    assert.dom('.c-block--urgent').exists({count: 1});
  });

  test('top product banner on author route', async function(assert) {
    //clear cookie
    document.cookie = `${config.productBannerCookiePrefix}12345=; expires=${moment().subtract(1, 'day')}; path=/`;
    // create banner;
    server.create('system-message');
    server.create('product-banner', {
      "id": "12345",
      "title": "Test Title",
      "description": "<p>Test Description</p>",
      "button_text": "Test Button",
      "button_link": "http://example.com",
    });

    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});
    await visit('/tags/dogs-and-cats');

    assert.dom('[data-test-top-product-banner]').exists();
    assert.dom('[data-test-top-product-banner] .o-box-banner__title').includesText("Test Title");
    assert.dom('[data-test-top-product-banner] .o-box-banner__dek').includesText("Test Description");
    assert.dom('[data-test-top-product-banner] .o-box-banner__cta').includesText("Test Button");
  });

  test('og metadata for curated tag page is correct', async function(assert) {
    const TITLE = 'Custom Title';
    const DESCRIPTION = 'Custom Description';
    const IMAGE_ID = 12345;
    const IMAGE_PATH = `https://example.com/images/${IMAGE_ID}/fill-1200x650/`;

    server.create('tagpage', {
      slug: 'dogs-and-cats',
      social_title: TITLE,
      social_text: DESCRIPTION,
      social_image: {id: IMAGE_ID}
    })
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});

    await visit('/tags/dogs-and-cats');

    assert.equal(document.querySelector("meta[property='og:title']")
      .getAttribute("content"), TITLE);
    assert.equal(document.querySelector("meta[name='twitter:title']")
      .getAttribute("content"), TITLE);
    assert.equal(document.querySelector("meta[property='og:description']")
      .getAttribute("content"), DESCRIPTION);
    assert.equal(document.querySelector("meta[property='og:image']")
      .getAttribute("content"), IMAGE_PATH);
    assert.equal(document.querySelector("meta[property='twitter:image']")
      .getAttribute("content"), IMAGE_PATH);
  });
});
