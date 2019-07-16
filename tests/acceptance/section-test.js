import { module, test } from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';
import { COUNT } from 'gothamist-web-client/routes/sections';

module('Acceptance | section', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting section page', async function(assert) {
    server.create('index-page', {
      // this is the key we'll look for in the `find?html_path` request
      // mirage doesn't support nested keys for `where` lookups
      html_path: 'news',
      title: 'News',
    });

    await visit('/news');

    assert.equal(currentURL(), '/news');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-section-heading]').hasText('News');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });

  test('section lists get updated with commentCount', async function(assert) {
    server.create('index-page', {
      id: '1',
      // this is the key we'll look for in the `find?html_path` request
      // mirage doesn't support nested keys for `where` lookups
      html_path: 'news',
      title: 'News',
    });

    const EXPECTED = server.schema.articles.where({indexPageId: '1'})
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.id]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/news');

    await click('[data-test-more-results]');

    // assert that articles loaded via "read more" also get updated
    findAll('[data-test-block]').forEach(block => {
      let id = block.dataset.testBlock;
      let { posts } = EXPECTED.find(d => d.identifiers.includes(id));
      assert.ok(block.querySelector('.c-block-meta__comments'), 'comments are rendered');
      assert.dom(block.querySelector('.c-block-meta__comments')).includesText(String(posts));
    });
  });
});
