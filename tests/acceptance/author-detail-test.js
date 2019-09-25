import moment from 'moment';

import { module, test} from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';
import { COUNT } from 'gothamist-web-client/routes/author-detail';

module('Acceptance | author detail', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  const AUTHOR_SLUG = 'foo-bar';

  hooks.beforeEach(() => {
    // author page
    server.create('page', {
      html_path: 'staff/foo-bar/',
      slug: AUTHOR_SLUG,
      title: 'Foo Bar',
    });
    // articles by author are looked up by `author_slug` via REST query
    server.createList('article', COUNT * 5, {
      author_slug: AUTHOR_SLUG,
    });
  });

  test('visiting author-detail', async function(assert) {
    await visit(`/staff/${AUTHOR_SLUG}`);

    assert.equal(currentURL(), '/staff/foo-bar');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-author-heading]').hasText('Foo Bar');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });

  test('author lists get updated with commentCount', async function(assert) {
    const EXPECTED = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});
    await visit(`/staff/${AUTHOR_SLUG}`);

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

    await visit(`/staff/${AUTHOR_SLUG}`);

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

    await visit(`/staff/${AUTHOR_SLUG}`);

    assert.dom('[data-test-top-product-banner]').exists();
    assert.dom('[data-test-top-product-banner] .o-box-banner__title').includesText("Test Title");
    assert.dom('[data-test-top-product-banner] .o-box-banner__dek').includesText("Test Description");
    assert.dom('[data-test-top-product-banner] .o-box-banner__cta').includesText("Test Button");
  });
});
