import moment from 'moment';

import { module, test } from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import defaultScenario from '../../mirage/scenarios/test-default';

import config from 'gothamist-web-client/config/environment';
import { COUNT } from 'gothamist-web-client/routes/sections';

import { CMS_TIMESTAMP_FORMAT } from '../../mirage/factories/consts';

module('Acceptance | section', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    defaultScenario(server);
  });

  test('visiting section page', async function(assert) {
    server.create('page', 'withArticles', {
      slug: 'news',
      title: 'News',
    });

    await visit('/news');

    assert.equal(currentURL(), '/news');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-section-heading]').hasText('News');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });

  test('section lists get updated with commentCount', async function(assert) {
    server.create('page', 'withArticles', {
      id: '1',
      slug: 'news',
      title: 'News',
    });

    const EXPECTED = server.schema.articles.where({pageId: '1'})
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.uuid]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/news');

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

  test('two most recent showAsFeature articles are in top spots', async function(assert) {
    const TITLE_1 = 'Featured 1';
    const TITLE_2 = 'Featured 2';

    const NEWS = server.create('page', 'withArticles', {slug: 'news'});
    server.create('article', {
      id: 'foo',
      title: TITLE_1,
      show_as_feature: true,
      page: NEWS,
      publication_date: moment.utc().subtract(2, 'minute').format(CMS_TIMESTAMP_FORMAT),
    });
    server.create('article', {
      id: 'bar',
      title: TITLE_2,
      show_as_feature: true,
      page: NEWS,
      publication_date: moment.utc().subtract(1, 'minute').format(CMS_TIMESTAMP_FORMAT),
    });
    // ensure the featured articles aren't just the newest
    server.create('article', 'now', {page: NEWS});

    await visit('/news');

    // mirage sorts articles by publication_date
    // most recently created article will appear in the number 1 spot, i.e. TITLE_2
    assert.dom('[data-test-section-featured] [data-test-col1] [data-test-block-title]').hasText(TITLE_2);
    assert.dom('[data-test-section-featured] [data-test-col2] [data-test-block-title]').hasText(TITLE_1);

    // load in all generated articles
    await click('[data-test-more-results]');
    // await click('[data-test-more-results]');

    assert.dom('[data-test-section-river] [data-test-block="foo"]').doesNotExist('featured articles should be filtered out of the river');
    assert.dom('[data-test-section-river] [data-test-block="bar"]').doesNotExist('featured articles should be filtered out of the river');
  });
});
