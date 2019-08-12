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

  test('visiting article route', async function(assert) {
    const article = server.create('article', 'withSection', {text: 'foo', section: 'food'});
    server.createList('article', 5, 'withSection', {
      show_as_feature: true,
      show_on_index_listing: true,
      section: 'food'
    });

    await visit(`/${article.html_path}`);

    assert.equal(currentURL(), `/${article.html_path}`);
    assert.dom('[data-test-top-nav]').exists('nav should exist at load');
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText('foo');
    assert.dom('[data-test-article-body] [data-test-inserted-ad]').exists({count: 1})

    // recirc
    assert.dom('[data-test-recirc-recent] .c-block').exists({count: 3});
    assert.dom('[data-test-recirc-featured] .c-block').exists({count: 1});
  });

  test('tweeting an article', async function() {
    const UTM = 'utm_medium=social&utm_source=twitter&utm_campaign=shared_twitter';

    const article = server.create('article');

    this.mock(window)
      .expects('open')
      .withArgs(`${SERVICE_MAP.twitter.shareBase}?text=${article.title}&via=gothamist&url=${URL(UTM)}`);

    await visit(`/${article.html_path}`);

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

    await visit(`/${article.html_path}`);

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

    await visit(`/${article.html_path}`);

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
    let article = server.create('article', {disable_comments: true});

    await visit(`/${article.html_path}`);

    assert.dom(`#${config.commentsAnchor}`).doesNotExist();
  });

  test('breadcrumbs', async function(assert) {
    const OPINION = server.create('article', {tags: [{slug: 'opinion', name: 'opinion'}]});
    const ANALYSIS = server.create('article', {tags: [{slug: 'analysis', name: 'analysis'}]});
    const SPONSOR = server.create('article', {sponsored_content: true});
    const WTC = server.create('article', {tags: [{slug: 'we the commuters', name: 'we the commuters'}]});

    await visit(OPINION.html_path);
    assert.dom('.o-breadcrumbs').includesText('Opinion');

    await visit(ANALYSIS.html_path);
    assert.dom('.o-breadcrumbs').includesText('Analysis');

    await visit(SPONSOR.html_path);
    assert.dom('.o-breadcrumbs').includesText('Sponsored');

    await visit(WTC.html_path);
    assert.dom('.o-breadcrumbs').includesText('We the Commuters');
  });

  test('navigating to comments section', async function(assert) {
    server.create('article', {
      text: faker.lorem.words(1000),
      show_as_feature: true,
      id: '1',
      section: 'news',
      slug: 'foo',
    });
    server.create('article', {
      text: faker.lorem.words(1000),
      show_as_feature: true,
      id: '2',
      section: 'news',
      slug: 'bar',
    });

    await visit('/');

    await click('[data-test-block="1"] [data-test-article-block-meta] a');

    assert.equal(currentURL(), `/news/foo?to=${config.commentsAnchor}`, 'comment anchor should be in query string');
    assert.ok(inViewport(find(`#${config.commentsAnchor}`)), 'comments area should be on screen');

    await click('[data-test-header-logo]');
    await click('[data-test-block="2"] [data-test-block-title] a');

    assert.equal(currentURL(), '/news/bar');
    assert.notOk(inViewport(find(`#${config.commentsAnchor}`)), 'comments area should not be on screen');
  });

  test('donation tout only appears after visiting 3 articles', async function(assert) {
    server.create('article', {section: 'food', slug: 'foo'});
    server.create('article', {section: 'food', slug: 'bar'});
    server.create('article', {section: 'food', slug: 'baz'});

    await visit('/food/foo');
    await scrollPastTarget(this, '.c-article__footer');

    assert.equal(currentURL(), '/food/foo');
    assert.dom('.c-donate-tout').doesNotExist('not active on first article');

    await visit('/food/bar');
    await scrollPastTarget(this, '.c-article__footer');

    assert.equal(currentURL(), '/food/bar');
    assert.dom('.c-donate-tout').doesNotExist('not active on second article');

    await visit('/food/baz');
    let reset = await scrollPastTarget(this, '.c-article__footer', () => find('.c-donate-tout.is-active'));

    assert.equal(currentURL(), '/food/baz');

    let viewCount = document.cookie.match(new RegExp(`${config.articleViewsCookie}=(\\d)`));
    assert.equal(viewCount[1], '3', 'tracks views');

    await click('[data-test-donate-close]');
    assert.dom('.c-donate-tout').doesNotExist('can close tout');

    reset();
  });

  test('donation tout disappears for 24 hours', async function(assert) {
    const cookieService = this.owner.lookup('service:cookies');
    let cookieSpy = this.spy(cookieService, 'write');

    server.create('article', {section: 'news', slug: 'foo'});
    server.create('article', {section: 'news', slug: 'bar'});

    await visit('/news/foo');
    await visit('/news/bar');
    await visit('/news/foo');

    assert.equal(currentURL(), '/news/foo');

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
      section: 'news'
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
      sections: `Gothamist,news,Gothamist news`,
      authors: `${article.related_authors[0].first_name} ${article.related_authors[0].last_name}`,
      path: `/${article.html_path.replace(/\/$/, '')}`,
      virtualReferrer: '/',

      // chartbeat will use the <title> tag on initial load, so we need to use it manually so things stay in sync
      // the document title is in sync with ember-cli-document-title
      title: document.title,
    }, 'first virtual call should have article data');

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
      virtualReferrer: `/${article.html_path.replace(/\/$/, '')}`,

      // chartbeat will use the <title> tag on initial load, so we need to use it manually so things stay in sync
      // the document title is in sync with ember-cli-document-title
      title: document.title,
    }, 'second virtual call should have home page data');
  });

  test('chartbeat is initialized with article metadata on direct navigation', async function(assert) {
    server.create('article', {
      section: 'news',
      related_authors: [{first_name: 'Foo', last_name: 'Bar'}],
      slug: 'foo',
    });

    await visit('/news/foo');

    assert.equal(window._sf_async_config.sections, "Gothamist,news,Gothamist news", 'should set section to article section');
    assert.equal(window._sf_async_config.authors, "Foo Bar", 'should set author to article author');
  });

  test('chartbeat virtualReferrer is updated on transition', async function(assert) {
    const spy = this.spy(window.pSUPERFLY, 'virtualPage');

    // first article
    server.create('article', 'withSection', {
      slug: 'foo',
      section: 'food',
    });
    // final article
    server.create('article', 'withSection', {
      slug: 'bar',
      show_as_feature: true,
      section: 'food',
    });

    await visit('/');

    await click('[data-test-block="1"] a');

    assert.equal(currentURL(), '/food/foo');

    await click('[data-test-recirc-recent] .c-block a');

    assert.equal(currentURL(), '/food/bar');

    assert.equal(spy.firstCall.args[0].virtualReferrer, '/');
    assert.equal(spy.secondCall.args[0].virtualReferrer, '/food/foo');
  });
});
