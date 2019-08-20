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
});
