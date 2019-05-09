import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';

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

  test('comment counts', async function(assert) {
    const ARTICLE = server.create('article');
    const EXPECTED = 100;
    server.get(`${config.disqusAPI}/threads/set.json`, {
      response: [{
        posts: EXPECTED, identifiers: [ARTICLE.id]
      }]
    });

    await visit(`/${ARTICLE.permalink}`);

    assert.dom('.c-article__meta-group a').hasText(`${EXPECTED} Comments`);
    assert.dom('#comments').exists({count: 1});
  });

  test('no disqus if comments are not allowed', async function(assert) {
    server.create('article', {allow_comments: false, permalink: 'foo'});

    await visit('/foo');

    assert.dom('#comments').doesNotExist();
  });

  test('breadcrumbs', async function(assert) {
    server.create('article', {permalink: 'opinion', tags: ['@opinion']});
    server.create('article', {permalink: 'analysis', tags: ['@analysis']});
    server.create('article', {permalink: 'sponsor', tags: ['@sponsor']});
    server.create('article', {permalink: 'wtc', tags: ['we the commuters']});

    await visit('/opinion');
    assert.dom('.o-breadcrumbs').includesText('Opinion');

    await visit('/analysis');
    assert.dom('.o-breadcrumbs').includesText('Analysis');

    await visit('/sponsor');
    assert.dom('.o-breadcrumbs').includesText('Sponsored');

    await visit('/wtc');
    assert.dom('.o-breadcrumbs').includesText('We the Commuters');

  });
});
