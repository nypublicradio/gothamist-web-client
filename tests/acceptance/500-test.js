import { module, skip } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | 500', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks)

  skip('visiting /500', async function(assert) {
    server.get('/topics/search', {}, 500);

    const fastboot = this.owner.lookup('service:fastboot');
    fastboot.isFastBoot = true;

    await visit('/');

    assert.equal(currentURL(), '/server-error');
  });
});
