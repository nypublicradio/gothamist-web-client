import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | titleize', function(hooks) {
  setupRenderingTest(hooks);

  test('it title cases', async function(assert) {
    this.set('inputValue', 'foo bar');

    await render(hbs`{{titleize inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'Foo Bar');
  });
});
