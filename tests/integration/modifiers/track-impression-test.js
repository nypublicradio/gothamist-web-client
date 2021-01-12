import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Modifier | track-impression', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it logs impression events to the dataLayer', async function(assert) {
    window.dataLayer = [];
    await render(hbs`<div {{track-impression}}
      data-category="Test Category"
      data-action="Test Action"
      data-label="Test Label"
    ></div>`);

    // wait a moment
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const data = window.dataLayer.pop();
    assert.equal(data['event'], "impression");
    assert.equal(data['eventCategory'], "Test Category");
    assert.equal(data['eventAction'], "Test Action");
    assert.equal(data['eventLabel'], "Test Label");
  });
});
