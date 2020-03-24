import moment from 'moment';

import { module, test } from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';
import { COUNT } from 'gothamist-web-client/routes/sections';

import { CMS_TIMESTAMP_FORMAT } from '../../mirage/factories/consts';

module('Acceptance | section', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting section page', async function(assert) {
    server.create('page', 'withArticles', {
      slug: 'news',
      title: 'News',
    });

    await visit('/news');

    assert.equal(currentURL(), '/news');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-section-heading]').hasText('News');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });

  test('og metadata is correct', async function(assert) {
    server.create('page', 'withArticles', {
      slug: 'news',
      title: 'News',
    });

    await visit('/news');

    assert.equal(document.querySelector("meta[property='og:title']")
      .getAttribute("content"),
      'News - Gothamist');
    assert.equal(document.querySelector("meta[name='twitter:title']")
      .getAttribute("content"),
      'News - Gothamist');
    assert.equal(document.querySelector("meta[property='og:image']")
      .getAttribute("content"),
      config.fallbackMetadataImage);
    assert.equal(document.querySelector("meta[property='twitter:image']")
      .getAttribute("content"),
      config.fallbackMetadataImage);
  });

  test('section lists get updated with commentCount', async function(assert) {
    server.create('page', 'withArticles', {
      id: '1',
      slug: 'news',
      title: 'News',
    });

    const EXPECTED = server.schema.articles.where({pageId: '1'})
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/news');

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

  test('two most recent showAsFeature articles are in top spots', async function(assert) {
    const TITLE_1 = 'Featured 1';
    const TITLE_2 = 'Featured 2';

    const NEWS = server.create('page', 'withArticles', {slug: 'news'});
    server.create('article', {
      id: 'foo',
      title: TITLE_1,
      show_as_feature: true,
      page: NEWS,
      publication_date: moment.utc().subtract(2, 'minute').format(CMS_TIMESTAMP_FORMAT),
    });
    server.create('article', {
      id: 'bar',
      title: TITLE_2,
      show_as_feature: true,
      page: NEWS,
      publication_date: moment.utc().subtract(1, 'minute').format(CMS_TIMESTAMP_FORMAT),
    });
    // ensure the featured articles aren't just the newest
    server.create('article', 'now', {page: NEWS});

    await visit('/news');

    // mirage sorts articles by publication_date
    // most recently created article will appear in the number 1 spot, i.e. TITLE_2
    assert.dom('[data-test-section-featured] [data-test-col1] [data-test-block-title]').hasText(TITLE_2);
    assert.dom('[data-test-section-featured] [data-test-col2] [data-test-block-title]').hasText(TITLE_1);

    // load in all generated articles
    await click('[data-test-more-results]');
    // await click('[data-test-more-results]');

    assert.dom('[data-test-section-river] [data-test-block="foo"]').doesNotExist('featured articles should be filtered out of the river');
    assert.dom('[data-test-section-river] [data-test-block="bar"]').doesNotExist('featured articles should be filtered out of the river');
  });

  test('breaking news on section route', async function(assert) {
    server.create('sitewide-component');
    server.create('breaking-news');

    server.create('page', 'withArticles', {
      slug: 'news',
      title: 'News',
    });
    await visit('/news');

    assert.dom('.c-block--urgent').exists({count: 1});
  });

  test('top product banner on section route', async function(assert) {
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

    server.create('page', 'withArticles', {
      slug: 'news',
      title: 'News',
    });
    await visit('/news');

    assert.dom('[data-test-top-product-banner]').exists();
    assert.dom('[data-test-top-product-banner] .o-box-banner__title').includesText("Test Title");
    assert.dom('[data-test-top-product-banner] .o-box-banner__dek').includesText("Test Description");
    assert.dom('[data-test-top-product-banner] .o-box-banner__cta').includesText("Test Button");
  });
});
