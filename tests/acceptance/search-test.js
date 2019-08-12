import sinon from 'sinon';

import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  click,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'gothamist-web-client/config/environment';


module('Acceptance | search', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);


  test('visiting /search', async function(assert) {
    await visit('/search');

    assert.equal(currentURL(), '/search');
  });

  test('searching on search', async function(assert) {
    // mirage endpoint just searches the `description` attr
    server.createList('article', 10, {description: 'foo'});
    server.createList('article', 3, {description: 'bar'});

    await visit('/search');

    await fillIn('.c-search-results__form input', 'foo');
    await click('.c-search-results__form [data-test-inline-search-submit]');

    assert.equal(currentURL(), '/search?q=foo', 'should update the url from the input');
    assert.dom('[data-test-block]').exists({count: 10});

    await click('[data-test-header-right] .c-search-toggle');
    await fillIn('[data-test-header-search] .c-search__input',  'bar');
    await click('[data-test-header-search] [data-test-inline-search-submit]');

    // can conduct new searches on search page
    assert.dom('[data-test-block]').exists({count: 3});
  });

  test('searching on search only makes one call', async function(assert) {
    const SEARCH_STUB = sinon.stub().returns({meta: {}, items: []});
    server.get(`${config.cmsServer}/api/v2/search/`, SEARCH_STUB);

    await visit('/search');

    await fillIn('.c-search-results__form input', 'foo');
    await click('.c-search-results__form [data-test-inline-search-submit]');

    assert.equal(currentURL(), '/search?q=foo');

    assert.ok(SEARCH_STUB.calledOnce, 'should only call one time');
  });

  test('searching from the header', async function(assert) {
    // mirage endpoint just searches the `description` attr
    server.createList('article', 5, {description: 'foo'});
    server.createList('article', 5, {description: 'bar'});

    await visit('/');

    await click('[data-test-header-right] .c-search-toggle');
    await fillIn('[data-test-header-search] .c-search__input',  'foo');
    await click('[data-test-header-search] [data-test-inline-search-submit]');

    assert.equal(currentURL(), '/search?q=foo');
    assert.dom('[data-test-block]').exists({count: 5});
  });

  test('searching from side menu', async function(assert) {
    // mirage endpoint just searches the `description` attr
    server.createList('article', 5, {description: 'foo'});
    server.createList('article', 5, {description: 'bar'});

    await visit('/');

    await click('[data-test-main-header] .c-main-header__left .o-menu-toggle'); // open side menu
    await fillIn('[data-test-side-menu] .c-search__input',  'foo');
    await click('[data-test-side-menu] [data-test-inline-search-submit]');

    assert.equal(currentURL(), '/search?q=foo');
    assert.dom('[data-test-block]').exists({count: 5});
  });

  test('no results', async function(assert) {
    await visit('/search');

    await fillIn('.c-search-results__form input', 'foo');
    await click('.c-search-results__form [data-test-inline-search-submit]');

    assert.dom('[data-test-search-results]').hasText('No Results');
  });
});
