import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | newsletter', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /newsletter', async function(assert) {
    await visit('/newsletter');

    assert.equal(currentURL(), '/newsletter');
    assert.dom('.newsletter-page .c-newsletter-form__concrete').exists({count: 1});
  });
});
