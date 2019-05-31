import moment from 'moment';
import { faker } from 'ember-cli-mirage';
import { module } from 'qunit';
import { visit, currentURL, click, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import test from 'ember-sinon-qunit/test-support/test';

import { scrollPastHeader, scrollPastTarget } from 'nypr-design-system/test-support';
import { SERVICE_MAP } from 'nypr-design-system/components/nypr-m-share-tools';
import { inViewport } from 'nypr-design-system/helpers/in-viewport';

import config from 'gothamist-web-client/config/environment';


const URL = UTM => {
  let url = window.location.toString();
  if (url.includes('?')) {
    url += `&${encodeURIComponent(UTM)}`;
  } else {
    url += `?${encodeURIComponent(UTM)}`;
  }
  return url;
}

module('Acceptance | article', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;
  });

  hooks.afterEach(() => {
    window.block_disqus = false;
  });

  test('visiting article route', async function(assert) {
    const article = server.create('article', {categories: [{basename: 'food'}]});
    server.createList('article', 5, {terms: ['@main'], categories: [{basename: 'food'}]});

    await visit(`/${article.permalink}`);

    assert.equal(currentURL(), `/${article.permalink}`);
    assert.dom('[data-test-top-nav]').exists('nav should exist at load');
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText(article.text + ' Advertisement');
    assert.dom('[data-test-article-body] #inserted-ad').exists({count: 1})

    // recirc
    assert.dom('[data-test-recirc-popular] .c-block').exists({count: 3});
    assert.dom('[data-test-recirc-featured] .c-block').exists({count: 1});
  });

  test('tweeting an article', async function() {
    const UTM = 'utm_medium=social&utm_source=twitter&utm_campaign=shared_twitter';

    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.twitter.shareBase}?text=${article.title}&via=gothamist&url=${URL(UTM)}`);

    await visit(`/${article.permalink}`);

    let reset = await scrollPastHeader(this);

    await click('[data-test-twitter-share]');

    reset();
  });

  test('redditing an article', async function() {
    const UTM = 'utm_medium=social&utm_source=reddit&utm_campaign=shared_reddit';
    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.reddit.shareBase}?title=${article.title}&url=${URL(UTM)}`);

    await visit(`/${article.permalink}`);

    let reset = await scrollPastHeader(this);

    await click('[data-test-reddit-share]');

    reset();
  });

  test('emailing an article', async function() {
    const UTM = 'utm_medium=social&utm_source=email&utm_campaign=shared_email';
    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.email.shareBase}?body=${article.title} - ${URL(UTM)}`);

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
    assert.dom(`#${config.commentsAnchor}`).exists({count: 1});
  });

  test('no disqus if comments are not allowed', async function(assert) {
    server.create('article', {allow_comments: false, permalink: 'foo'});

    await visit('/foo');

    assert.dom(`#${config.commentsAnchor}`).doesNotExist();
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

  test('navigating to comments section', async function(assert) {
    server.create('article', {
      text: faker.lorem.words(1000),
      tags: ['@main'],
      id: '1',
      permalink: 'foo',
    });

    await visit('/');

    await click('[data-test-block="1"] [data-test-article-block-meta] a');

    assert.equal(currentURL(), `/foo?to=${config.commentsAnchor}`);
    assert.ok(inViewport(find(`#${config.commentsAnchor}`)));
  });

  test('donation tout disappears for 24 hours', async function(assert) {
    // clear the cookie
    document.cookie = `${config.donateCookie}=1; expires=${moment().subtract(1, 'day')}`;

    const cookieService = this.owner.lookup('service:cookies');
    let cookieSpy = this.spy(cookieService, 'write');

    server.create('article', {permalink: 'foo', id: '1'});

    await visit('/foo');

    assert.equal(currentURL(), '/foo');

    let reset = await scrollPastTarget(this, '.c-article__footer', () => find('.c-donate-tout.is-active'));

    await click('[data-test-donate-close]');

    assert.ok(document.cookie.match(config.donateCookie), 'cookie is set');
    let { expires } = cookieSpy.firstCall.args[2];
    assert.equal(moment().add(24, 'hours').date(), moment(expires).date(), 'cookie is set to expire tomorrow');

    reset();

    // clear the cookie
    document.cookie = `${config.donateCookie}=1; expires=${moment().subtract(1, 'day')}`;
  });
});
