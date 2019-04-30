import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | multiply', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    await render(hbs`{{multiply 5 5}}`);

    assert.equal(this.element.textContent.trim(), '25');

    await render(hbs`{{multiply 5 0}}`);

    assert.equal(this.element.textContent.trim(), '0');

    await render(hbs`{{multiply 5}}`);

    assert.equal(this.element.textContent.trim(), '');

    await render(hbs`{{multiply}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
