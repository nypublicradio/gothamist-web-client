import moment from 'moment';

import { module, test } from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import { TOTAL_COUNT } from 'gothamist-web-client/routes/index';
import config from 'gothamist-web-client/config/environment';

import { CMS_TIMESTAMP_FORMAT } from '../../mirage/factories/consts';


module('Acceptance | homepage', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting homepage', async function(assert) {
    server.create('homepage');
    server.createList('article', 10, 'now', {
      show_as_feature: true,
    });
    server.createList('article', TOTAL_COUNT * 2);

    server.create('wnyc-story', {id: 'gothamist-wnyc-crossposting'});

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test-featured-block-list]').exists();
    assert.dom('[data-test-featured-block-list] [data-test-block]').exists();
    assert.dom('[data-test-block]').exists({count: TOTAL_COUNT});

    const mainArticleInRiver = server.schema.articles.where({show_as_feature: true}).slice(-1).models[0];
    assert.dom(`[data-test-block="${mainArticleInRiver.id}"]`).doesNotHaveClass('c-block--horizontal', 'articles in the "river" tagged main should not have a "--horizontal" modifier class');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: TOTAL_COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of TOTAL_COUNT');
  });

  test('og metadata is correct', async function(assert) {
    server.create('homepage');
    server.createList('article', 10, 'now', {
      show_as_feature: true,
    });
    server.createList('article', TOTAL_COUNT * 2);

    server.create('wnyc-story', {id: 'gothamist-wnyc-crossposting'});

    await visit(`/`);

    const title = 'Gothamist: New York City Local News, Food, Arts & Events';
    const desc = 'Gothamist is a website about New York City news, arts and events, and food, brought to you by New York Public Radio.';
    const imagePath = window.location.origin + config.fallbackMetadataImage;

    assert.equal(document.querySelector("meta[property='og:title']")
      .getAttribute("content"), title);
    assert.equal(document.querySelector("meta[name='twitter:title']")
      .getAttribute("content"), title);
    assert.equal(document.querySelector("meta[property='og:description']")
      .getAttribute("content"), desc);
    assert.equal(document.querySelector("meta[property='og:image']")
      .getAttribute("content"), imagePath);
    assert.equal(document.querySelector("meta[property='twitter:image']")
      .getAttribute("content"), imagePath);
  });

  test('sponsored posts younger than 24 hours appear in sponsored tout', async function(assert) {
    server.create('homepage');
    const TITLE = 'foo';

    server.create('article', {
      id: 'sponsored',
      title: TITLE,
      sponsored_content: true,
      publication_date: moment.utc().subtract(12, 'hours').format(CMS_TIMESTAMP_FORMAT),
    });

    await visit('/');
    assert.dom('[data-test-sponsored-tout] .c-block__title').hasText(TITLE);
    assert.dom('[data-test-block="sponsored"]').exists({count: 1}, 'should only appear once')
  });

  test('sponsored posts older than 24 hours do not appear in sponsored tout', async function(assert) {
    server.create('homepage');

    server.create('article', {
      sponsored_content: true,
      publication_date: moment.utc().subtract(36, 'hours').format(CMS_TIMESTAMP_FORMAT),
    });

    await visit('/');
    assert.dom('[data-test-sponsored-tout]').doesNotExist();
  });

  test('sponsored posts tagged @main and between 24 and 48 hours old appear in featured area', async function(assert) {
    server.create('homepage');

    server.create('article', {
      id: 'sponsored-main',
      show_as_feature: true,
      sponsored_content: true,
      publication_date: moment.utc().subtract(36, 'hours').format(CMS_TIMESTAMP_FORMAT),
    });

    server.create('article', {
      id: 'sponsored',
      sponsored_content: true,
      publication_date: moment.utc().subtract(12, 'hours').format(CMS_TIMESTAMP_FORMAT),
    });

    server.createList('article', 10, {show_as_feature: true});

    await visit('/');
    assert.dom('[data-test-featured-block-list] [data-test-block-list-item="2"] [data-test-block="sponsored-main"]').exists('sponsored post is in the featured list in the 3rd position');

    assert.dom('[data-test-sponsored-tout] .c-block__title').exists('regular sponsored post should also appear too');
  });

  test('articles get updated with commentCount', async function(assert) {
    server.create('homepage');

    server.createList('article', 10, {
      show_as_feature: true,
    });
    server.createList('article', TOTAL_COUNT * 2);
    const EXPECTED = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/');

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

  test('featured article pinned content appears and is in the correct order', async function(assert) {
    server.createList('article', 10, 'now');
    // create homepage with a pinned featured content collection
    server.create('homepage', 'hasFeaturedCollection');

    await visit('/');

    assert.dom('.c-featured-blocks__col1 [data-test-block-title]').exists();

    // create array with pinned featured content headings
    let featuredHeadings = document.querySelectorAll('.c-featured-blocks h3')

    // compare to expected headings
    assert.equal(featuredHeadings[0].innerText, "Insignificant Blizzard Can't Stop Cronut Fans From Lining Up This Morning")
    assert.equal(featuredHeadings[1].innerText, "Gorgeous Mandarin Duck, Rarely Seen In U.S., Mysteriously Appears In Central Park",)
    assert.equal(featuredHeadings[2].innerText, "Delicious Tibetan Momos And Noodles At New East Village Location Of Lhasa")
    assert.equal(featuredHeadings[3].innerText, "SEE IT: Cynthia Nixon Orders Cinnamon Raisin Bagel With... Lox And Capers")
  });

  test('when featured content is pinned & sponsored posts tagged @main and between 24 and 48 hours old appear in featured area', async function(assert) {
    server.create('homepage', 'hasFeaturedCollection');

    server.create('article', {
      id: 'sponsored-main',
      show_as_feature: true,
      sponsored_content: true,
      publication_date: moment.utc().subtract(36, 'hours').format(CMS_TIMESTAMP_FORMAT),
    });

    server.create('article', {
      id: 'sponsored',
      sponsored_content: true,
      publication_date: moment.utc().subtract(12, 'hours').format(CMS_TIMESTAMP_FORMAT),
    });

    server.createList('article', 10, {show_as_feature: true});

    await visit('/');
    assert.dom('[data-test-featured-block-list] [data-test-block-list-item="2"] [data-test-block="sponsored-main"]').exists('sponsored post is in the featured list in the 3rd position');

    assert.dom('[data-test-sponsored-tout] .c-block__title').exists('regular sponsored post should also appear too');
  });

  test('featured article pinned content collection with lead galleries displays correctly', async function(assert) {
    server.createList('article', 10, 'now');
    server.create('homepage', 'hasFeaturedCollectionWithGalleries');

    await visit('/');

    const EXPECTED_IMG = `https://example.com/images/1283/fill-800x533/`

    assert.dom('.c-featured-blocks__col1 img').exists();
    assert.dom('.c-featured-blocks__col1 img').hasAttribute('src', EXPECTED_IMG);
    assert.dom('.c-featured-blocks__col1 .c-block__title--has-icon.c-block__title--is-gallery').exists();
  });

  test('featured article pinned content collection displays comment counts', async function(assert) {
    server.createList('article', 100, 'now');
    server.create('homepage', 'hasFeaturedCollection');

    const EXPECTED = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));

    // fetch fake disqus data
    server.get(`${config.disqusAPI}/threads/set.json`, (schema, request) => {
        let ids =  request.url.split('&').filter(p => p.startsWith('thread:ident=')).map(p => p.replace('thread:ident=', ''));
        let filteredResponse = EXPECTED.filter(item => ids.includes(item.identifiers[0]))
        return {response: filteredResponse}
    });

    await visit('/');

    // compare and ensure comments posts are what's expected
    findAll('.c-featured-blocks .c-block').forEach(block => {
      let id = block.dataset.testBlock;
      let { uuid } = server.schema.articles.find(id);
      let { posts } = EXPECTED.find(d => d.identifiers.includes(uuid));
      assert.ok(block.querySelector('.c-block-meta__comments'), 'comments are rendered');
      assert.dom(block.querySelector('.c-block-meta__comments') || 'comments blocks').includesText(String(posts));
    });
  });
});
