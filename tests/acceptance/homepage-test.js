import moment from 'moment';

import { module, test } from 'qunit';
import { visit, currentURL, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import { TOTAL_COUNT } from 'gothamist-web-client/routes/index';
import config from 'gothamist-web-client/config/environment';


module('Acceptance | homepage', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting homepage', async function(assert) {
    server.createList('article', 10, {
      tags: ['@main']
    });
    server.createList('article', TOTAL_COUNT * 2);

    server.create('wnyc-story', {id: 'gothamist-wnyc-crossposting'});

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test-featured-block-list]').exists();
    assert.dom('[data-test-featured-block-list] [data-test-block]').exists();
    assert.dom('[data-test-block]').exists({count: TOTAL_COUNT});

    const mainArticleInRiver = server.schema.articles.where({tags:['@main']}).slice(-1).models[0];
    assert.dom(`[data-test-block="${mainArticleInRiver.id}"]`).doesNotHaveClass('c-block--horizontal', 'articles in the "river" tagged main should not have a "--horizontal" modifier class');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: TOTAL_COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of TOTAL_COUNT');
  });

  test('sponsored posts younger than 24 hours appear in sponsored tout', async function(assert) {
    const TITLE = 'foo';

    server.create('article', {
      id: 'sponsored',
      title: TITLE,
      tags: ['@sponsor'],
      authored_on_utc: moment().subtract(12, 'hours'),
    });

    await visit('/');
    assert.dom('[data-test-sponsored-tout] .c-block__title').hasText(TITLE);
    assert.dom('[data-test-block="sponsored"]').exists({count: 1}, 'should only appear once')
  });

  test('sponsored posts older than 24 hours do not appear in sponsored tout', async function(assert) {

    server.create('article', {
      tags: ['@sponsor'],
      authored_on_utc: moment().subtract(36, 'hours'),
    });

    await visit('/');
    assert.dom('[data-test-sponsored-tout]').doesNotExist();
  });

  test('articles get updated with commentCount', async function(assert) {
    server.createList('article', 10, {
      tags: ['@main']
    });
    server.createList('article', TOTAL_COUNT * 2);
    const EXPECTED = server.schema.articles.all()
      .models.map((a, i) => ({posts: Math.ceil(Math.random() * i + 1), identifiers: [a.id]}));

    server.get(`${config.disqusAPI}/threads/set.json`, {response: EXPECTED});

    await visit('/');

    await click('[data-test-more-results]');

    // assert that articles loaded via "read more" also get updated
    findAll('[data-test-block]').forEach(block => {
      let id = block.dataset.testBlock;
      let { posts } = EXPECTED.find(d => d.identifiers.includes(id));
      assert.ok(block.querySelector('.c-block-meta__comments'), 'comments are rendered');
      assert.dom(block.querySelector('.c-block-meta__comments')).includesText(String(posts));
    });
  })
});
