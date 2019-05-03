import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | article', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;
  });

  hooks.afterEach(() => {
    window.block_disqus = false;
  })

  test('visiting article route', async function(assert) {
    const article = server.create('article');

    await visit(`/${article.permalink}`);

    assert.equal(currentURL(), `/${article.permalink}`);
    assert.dom('[data-test-top-nav]').exists('nav should exist at load');
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText(article.text);
  });

  test('no disqus if comments are not allowed', async function(assert) {
    server.create('article', {allow_comments: false, permalink: 'foo'});

    await visit('/foo');

    assert.dom('#comments').doesNotExist();
  });
});
