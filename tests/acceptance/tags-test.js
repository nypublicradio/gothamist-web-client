import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import { COUNT } from 'gothamist-web-client/routes/tags';

module('Acceptance | tags', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /tags', async function(assert) {
    server.createList('article', COUNT * 5, {tags: ['dogs and cats']});
    await visit('/tags/dogs%20and%20cats');

    assert.equal(currentURL(), '/tags/dogs%20and%20cats');

    assert.dom('[data-test-block]').exists({count: COUNT});
    assert.dom('[data-test-tag-heading]').hasText('Dogs And Cats');

    await click('[data-test-more-results]');

    assert.dom('[data-test-block]').exists({count: COUNT * 2}, 'Clicking "read more" brings in another set of results equal to the amount of COUNT');
  });
});
