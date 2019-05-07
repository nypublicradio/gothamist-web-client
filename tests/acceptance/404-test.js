import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | 404', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('404 page', async function(assert) {
    server.createList('article', 4);
    await visit('/nope');

    assert.equal(currentURL(), '/nope');

    assert.dom('[data-test-block]').exists({count: 4}, 'renders 4 popular stories');
  });
});
