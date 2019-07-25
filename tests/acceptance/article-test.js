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
import { ANCESTRY } from '../unit/fixtures/article-fixtures';


const URL = UTM => {
  let url = window.location.toString();
  if (url.includes('?')) {
    url += `&${UTM}`;
  } else {
    url += `?${UTM}`;
  }
  return encodeURIComponent(url);
}

module('Acceptance | article', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    document.cookie = `${config.donateCookie}=; expires=${moment().subtract(1, 'day')}; path=/`;
    document.cookie = `${config.articleViewsCookie}=; expires=${moment().subtract(1, 'day')}; path=/`;
    window.block_disqus = true;
    window.pSUPERFLY = {virtualPage: () => true};
  });

  hooks.afterEach(() => {
    document.cookie = `${config.donateCookie}=; expires=${moment().subtract(1, 'day')}; path=/`;
    document.cookie = `${config.articleViewsCookie}=; expires=${moment().subtract(1, 'day')}; path=/`;
    window.block_disqus = false;
  });

    const article = server.create('article', {_section: 'food'});
    server.createList('article', 5, {terms: ['@main'], _section: 'food'});
  test('visiting article route', async function(assert) {

    await visit(`/${article.path}`);

    assert.equal(currentURL(), `/${article.path}`);
    assert.dom('[data-test-top-nav]').exists('nav should exist at load');
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText(article.text);
    assert.dom('[data-test-article-body] [data-test-inserted-ad]').exists({count: 1})

    // recirc
    assert.dom('[data-test-recirc-popular] .c-block').exists({count: 3});
    assert.dom('[data-test-recirc-featured] .c-block').exists({count: 1});
  });

  skip('tweeting an article', async function() {
    const UTM = 'utm_medium=social&utm_source=twitter&utm_campaign=shared_twitter';

    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.twitter.shareBase}?text=${article.title}&via=gothamist&url=${URL(UTM)}`);

    await visit(`/${article.path}`);

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

    await visit(`/${article.path}`);

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

    await visit(`/${article.path}`);

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

    await visit(`/${ARTICLE.html_path}`);

    assert.dom('.c-article__meta-group a').hasText(`${EXPECTED} Comments`);
    assert.dom(`#${config.commentsAnchor}`).exists({count: 1});
  });

  test('no disqus if comments are not allowed', async function(assert) {
    server.create('article', {allow_comments: false, path: 'foo'});

    await visit('/foo');

    assert.dom(`#${config.commentsAnchor}`).doesNotExist();
  });

  test('breadcrumbs', async function(assert) {
    server.create('article', {path: 'opinion', tags: ['@opinion']});
    server.create('article', {path: 'analysis', tags: ['@analysis']});
    server.create('article', {path: 'sponsor', tags: ['@sponsor']});
    server.create('article', {path: 'wtc', tags: ['we the commuters']});

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
      path: 'foo',
    });
    server.create('article', {
      text: faker.lorem.words(1000),
      tags: ['@main'],
      id: '2',
      path: 'bar',
    });

    await visit('/');

    await click('[data-test-block="1"] [data-test-article-block-meta] a');

    assert.equal(currentURL(), `/foo?to=${config.commentsAnchor}`, 'comment anchor should be in query string');
    assert.ok(inViewport(find(`#${config.commentsAnchor}`)), 'comments area should be on screen');

    await click('[data-test-header-logo]');
    await click('[data-test-block="2"] [data-test-block-title] a');

    assert.equal(currentURL(), '/bar');
    assert.notOk(inViewport(find(`#${config.commentsAnchor}`)), 'comments area should not be on screen');
  });

  test('donation tout only appears after visiting 3 articles', async function(assert) {
    server.create('article', {path: 'foo'});
    server.create('article', {path: 'bar'});
    server.create('article', {path: 'baz'});

    await visit('/foo');
    await scrollPastTarget(this, '.c-article__footer');

    assert.equal(currentURL(), '/foo');
    assert.dom('.c-donate-tout').doesNotExist('not active on first article');

    await visit('/bar');
    await scrollPastTarget(this, '.c-article__footer');

    assert.equal(currentURL(), '/bar');
    assert.dom('.c-donate-tout').doesNotExist('not active on second article');

    await visit('/baz');
    let reset = await scrollPastTarget(this, '.c-article__footer', () => find('.c-donate-tout.is-active'));

    assert.equal(currentURL(), '/baz');

    let viewCount = document.cookie.match(new RegExp(`${config.articleViewsCookie}=(\\d)`));
    assert.equal(viewCount[1], '3', 'tracks views');

    await click('[data-test-donate-close]');
    assert.dom('.c-donate-tout').doesNotExist('can close tout');

    reset();
  });

  test('donation tout disappears for 24 hours', async function(assert) {
    const cookieService = this.owner.lookup('service:cookies');
    let cookieSpy = this.spy(cookieService, 'write');

    server.create('article', {path: 'foo'});
    server.create('article', {path: 'bar'});

    await visit('/foo');
    await visit('/bar');
    await visit('/foo');

    assert.equal(currentURL(), '/foo');

    let reset = await scrollPastTarget(this, '.c-article__footer', () => find('.c-donate-tout.is-active'));

    await click('[data-test-donate-close]');

    assert.ok(document.cookie.match(config.donateCookie), 'cookie is set');
    let { expires } = cookieSpy.getCall(3).args[2];
    assert.equal(moment().add(24, 'hours').date(), moment(expires).date(), 'cookie is set to expire tomorrow');
    let viewCount = document.cookie.match(new RegExp(`${config.articleViewsCookie}=(\\d)`));
    assert.equal(viewCount[1], '0', 'tracked views should reset when closed');

    reset();
  });

  test('chartbeat virtualPage is called with correct args correct number of times', async function(assert) {
    const article = server.create('article', {
      ancestry: ANCESTRY,
    });

    const spy = this.spy(window.pSUPERFLY, 'virtualPage');

    await visit('/');

    await click('[data-test-block="1"] a'); // first article

    await click('[data-test-header-logo]'); // back to homepage

    assert.ok(spy.calledTwice, 'should skip the first call because chartbeat triggers a pageview onload of the JS library');
    const firstCall = spy.getCall(0).args[0];
    const secondCall = spy.getCall(1).args[0]

    assert.deepEqual(Object.keys(firstCall), [
      "sections",
      "authors",
      "path",
      "title",
      "virtualReferrer",
    ]);
    assert.deepEqual(firstCall, {
      sections: `Gothamist,News,Gothamist News`,
      authors: article.author_nickname,
      path: `/${article.path}`,
      virtualReferrer: '/',

      // chartbeat will use the <title> tag on initial load, so we need to use it manually so things stay in sync
      // the document title is in sync with ember-cli-document-title
      title: document.title,
    });

    assert.deepEqual(Object.keys(secondCall), [
      "sections",
      "authors",
      "path",
      "title",
      "virtualReferrer",
    ]);
    assert.deepEqual(secondCall, {
      sections: 'Gothamist,Home,Gothamist Home',
      authors: '',
      path: location.pathname,
      virtualReferrer: `/${article.path}`,

      // chartbeat will use the <title> tag on initial load, so we need to use it manually so things stay in sync
      // the document title is in sync with ember-cli-document-title
      title: document.title,
    });
  });

  test('chartbeat is initialized with article metadata on direct navigation', async function(assert) {
    const SECTION = 'news';
    const AUTHOR = 'Foo Bar';
    server.create('article', {
      _section: SECTION,
      author_nickname: AUTHOR,
      path: 'foo',
    });

    await visit('/foo');

    assert.equal(window._sf_async_config.sections, "Gothamist,news,Gothamist news", 'should set section to article section');
    assert.equal(window._sf_async_config.authors, "Foo Bar", 'should set author to article author');
  });

  test('chartbeat virtualReferrer is updated on transition', async function(assert) {
    const spy = this.spy(window.pSUPERFLY, 'virtualPage');

    // first article
    server.create('article', {
      path: 'foo',
      _section: 'food',
    });
    // final article
    server.create('article', {
      path: 'bar',
      terms: ['@main'],
      _section: 'food',
    });

    await visit('/');

    await click('[data-test-block="1"] a');

    assert.equal(currentURL(), '/foo');

    await click('[data-test-recirc-popular] .c-block a');

    assert.equal(currentURL(), '/bar');

    assert.equal(spy.firstCall.args[0].virtualReferrer, '/');
    assert.equal(spy.secondCall.args[0].virtualReferrer, '/foo');
  });
});
