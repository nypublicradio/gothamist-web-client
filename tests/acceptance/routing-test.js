import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

function containsText(text) {
  return [...document.querySelectorAll('a')].find(el => el.textContent.includes(text))
}

module('Acceptance | routing', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('query strings are maintained on articles (dynamic route)', async function(assert) {
    const article = server.create('article', 'withSection', {text: 'foo', section: 'food'});
    // First visit has query string
    await visit(`/food/${article.slug}?a=1&b=2`)
    assert.equal(currentURL(), `/food/${article.slug}?a=1&b=2`);

    // Homepage does *not* have query string
    await click('.c-main-header__branding a')
    assert.equal(currentURL(), `/`);

    // Returning to article does not have query string (i.e. non-sticky query
    // params)
    await click(containsText(article.title))
    assert.equal(currentURL(), `/food/${article.slug}`);
  });

  test('query strings are maintained on homepage (hardcoded route)', async function(assert) {
    let articles = server.createList('article', 5, 'withSection', {
      show_as_feature: true,
      show_on_index_listing: true,
      section: 'food'
    });
    // Homepage has query params
    await visit(`/?a=1&b=2`)
    assert.equal(currentURL(), `/?a=1&b=2`);

    // Query params are not sticky to URL after clicking on article
    await click(containsText(articles[0].title))
    assert.equal(currentURL(), `/food/${articles[0].slug}`)
  });
});
