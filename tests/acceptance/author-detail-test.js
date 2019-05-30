import { module, test } from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';
import { COUNT } from 'gothamist-web-client/routes/author-detail';

module('Acceptance | author detail', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting author-detail', async function(assert) {
    server.createList('article', COUNT * 5, {author_nickname: 'Foo Bar'});
    await visit('/author/Foo%20Bar');

    assert.equal(currentURL(), '/author/Foo%20Bar');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-author-heading]').hasText('Foo Bar');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });

  test('author lists get updated with commentCount', async function(assert) {
    server.createList('article', COUNT * 5, {author_nickname: ['Foo']});
    const EXPECTED = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.id]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/author/Foo');

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
