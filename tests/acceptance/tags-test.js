import moment from 'moment';

import { module, test } from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';
import { COUNT } from 'gothamist-web-client/routes/tags';

module('Acceptance | tags', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /tags', async function(assert) {
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});
    await visit('/tags/dogs-and-cats');

    assert.equal(currentURL(), '/tags/dogs-and-cats');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-tag-heading]').hasText('dogs and cats');
    assert.dom('[data-test-section-label]').hasText('Food', 'section label is populated');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });

  test('tag lists get updated with commentCount', async function(assert) {
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs', name: 'dogs'}], tag_slug: 'dogs'});
    const EXPECTED = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/tags/dogs');

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

  test('breaking news on author route', async function(assert) {
    server.create('sitewide-component');
    server.create('breaking-news');

    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});
    await visit('/tags/dogs-and-cats');

    assert.dom('.c-block--urgent').exists({count: 1});
  });

  test('top product banner on author route', async function(assert) {
    //clear cookie
    document.cookie = `${config.productBannerCookiePrefix}12345=; expires=${moment().subtract(1, 'day')}; path=/`;
    // create banner;
    server.create('system-message');
    server.create('product-banner', {
      "id": "12345",
      "title": "Test Title",
      "description": "<p>Test Description</p>",
      "button_text": "Test Button",
      "button_link": "http://example.com",
    });

    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});
    await visit('/tags/dogs-and-cats');

    assert.dom('[data-test-top-product-banner]').exists();
    assert.dom('[data-test-top-product-banner] .o-box-banner__title').includesText("Test Title");
    assert.dom('[data-test-top-product-banner] .o-box-banner__dek').includesText("Test Description");
    assert.dom('[data-test-top-product-banner] .o-box-banner__cta').includesText("Test Button");
  });

  test('tag page customization works', async function(assert) {
    const tagPage = server.create('tagpage', {slug: 'dogs-and-cats'})
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});
    await visit('/tags/dogs-and-cats');

    const headerImage =  tagPage.designed_header[0].value.image.id
    const headerImageUrl = `https://example.com/images/${headerImage}/fill-1600x277/`
    const topPageText = tagPage.top_page_zone[0].value.split('</p')[0].replace('<p>','')
    const midpageText = tagPage.midpage_zone[0].value.split('</p')[0].replace('<p>','')

    assert.dom('[data-test-designed-header] > img').hasAttribute('src', headerImageUrl)
    assert.dom('[data-test-top-page-zone]').includesText(topPageText)
    assert.dom('[data-test-midpage-zone]').includesText(midpageText)
  });

  test('curated content appears in top page zone', async function(assert) {
    const tagPage = server.create('tagpage', {slug: 'dogs-and-cats'}, 'hasCollectionInTopPageZone')
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});

    const articles = tagPage.top_page_zone[0].value.pages

    await visit('/tags/dogs-and-cats');

    const cards = findAll('[data-test-top-page-zone] [data-test-block]')
    assert.equal(cards.length, 2, 'top page zone should contain two article cards')

    cards.forEach((card, index) => {
      assert.dom('[data-test-block-title]', card).hasText(articles[index].title, `card ${index} should show the correct title`)
    })
  });


  test('curated content appears in midpage zone', async function(assert) {
    const tagPage = server.create('tagpage', {slug: 'dogs-and-cats'}, 'hasCollectionInMidpageZone')
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});

    const articles = tagPage.midpage_zone[0].value.pages

    await visit('/tags/dogs-and-cats');

    const cards = findAll('[data-test-midpage-zone] [data-test-block]')
    assert.equal(cards.length, 2, 'midpage zone should contain two article cards')

    cards.forEach((card, index) => {
      assert.dom('[data-test-block-title]', card).hasText(articles[index].title, `card ${index} should show the correct title`)
    })
  });

  test('curated content shows comment counts', async function(assert) {
    const tagPage = server.create('tagpage', {slug: 'dogs-and-cats'}, 'hasCollectionInTopPageZone', 'hasCollectionInMidpageZone')
    server.createList('article', COUNT * 5, {tags: [{slug: 'dogs-and-cats', name: 'dogs and cats'}], section: 'food', tag_slug: 'dogs-and-cats'});


    // fake disqus API
    const COMMENT_DATA = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));
    server.get(`${config.disqusAPI}/threads/set.json`, (schema, request) => {
        let ids =  request.url.split('&').filter(p => p.startsWith('thread:ident=')).map(p => p.replace('thread:ident=', ''));
        let filteredResponse = EXPECTED.filter(item => ids.includes(item.identifiers[0]))
        return {response: filteredResponse}
    });

    const topArticles = tagPage.top_page_zone[0].value.pages
    const midArticles = tagPage.midpage_zone[0].value.pages
    const allArticles = topArticles.concat(midArticles)

    await visit('/tags/dogs-and-cats');

    const topCards = findAll('[data-test-top-page-zone] [data-test-block]')
    const midCards = findAll('[data-test-midpage-zone] [data-test-block]')
    const allCards = topCards.concat(midCards)

    allCards.forEach((card, index) => {
      let commentCount = COMMENT_DATA.find(d => d.identifiers.includes(allArticles[index].id))
      assert.dom('.c-block-meta__comments', card).exists(`card ${index} should have comments`)
      assert.dom('.c-block-meta__comments', card).includesText(String(commentCount), `card ${index} should show the correct comment count`)
    })
  });

});
