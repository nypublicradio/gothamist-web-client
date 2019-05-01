import moment from 'moment';

import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import { TOTAL_COUNT } from 'gothamist-web-client/routes/index';


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
      title: TITLE,
      tags: ['@sponsor'],
      authored_on: moment().subtract(12, 'hours'),
    });

    await visit('/');
    assert.dom('[data-test-sponsored-tout] .c-block__title').hasText(TITLE);
  });

  test('sponsored posts older than 24 hours do not appear in sponsored tout', async function(assert) {

    server.create('article', {
      tags: ['@sponsor'],
      authored_on: moment().subtract(36, 'hours'),
    });

    await visit('/');
    assert.dom('[data-test-sponsored-tout]').doesNotExist();
  })
});
