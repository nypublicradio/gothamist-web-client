import { module, skip } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | breaking news', function(hooks) {
  setupApplicationTest(hooks);

  skip('visiting /breaking-news', async function(assert) {
    await visit('/breaking-news');

    assert.equal(currentURL(), '/breaking-news');
  });
});
