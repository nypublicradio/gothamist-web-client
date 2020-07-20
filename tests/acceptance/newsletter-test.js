import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | newsletter', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /newsletter', async function(assert) {
    await visit('/newsletter');

    assert.equal(currentURL(), '/newsletter');
    assert.dom('.c-newsletter-form__concrete').exists(1);
  });
});
