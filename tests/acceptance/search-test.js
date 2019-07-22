import { module, test } from 'qunit';
import { visit, currentURL, fillIn, triggerKeyEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

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

    await visit('/search');

    await fillIn('[data-test-search-input]', 'foo');
    await triggerKeyEvent('[data-test-search-input]', 'keyup', 'Enter');

    assert.dom('[data-test-block]').exists({count: 10});
  })
});
