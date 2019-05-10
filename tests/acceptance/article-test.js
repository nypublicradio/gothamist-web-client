import { module } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import test from 'ember-sinon-qunit/test-support/test';

import { scrollPastHeader } from 'nypr-design-system/test-support/helpers'
import { SERVICE_MAP } from 'nypr-design-system/components/nypr-m-share-tools';

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

  test('tweeting an article', async function() {
    const URL = window.location.toString();

    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.twitter.shareBase}?text=${article.title}&url=${URL}`);

    await visit(`/${article.permalink}`);

    let reset = await scrollPastHeader(this);

    await click('[data-test-twitter-share]');

    reset();
  });

  test('redditing an article', async function() {
    const URL = window.location.toString();
    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.reddit.shareBase}?title=${article.title}&url=${URL}`);

    await visit(`/${article.permalink}`);

    let reset = await scrollPastHeader(this);

    await click('[data-test-reddit-share]');

    reset();
  });

  test('emailing an article', async function() {
    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.email.shareBase}?body=${article.title} - ${article.permalink}`);

    await visit(`/${article.permalink}`);

    let reset = await scrollPastHeader(this);

    await click('[data-test-email-share]');

    reset();
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
