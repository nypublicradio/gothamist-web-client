import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | search-field', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{search-field}}`);
    assert.dom('input[type=search]').exists();
  });

  test('hitting enter performs search action', async function(assert) {
    assert.expect(1);
    const VAL = 'foo';
    this.set('search', val => assert.equal(val, VAL));

    await render(hbs`{{search-field search=search}}`);
    await fillIn('input[type=search]', VAL);
    await triggerKeyEvent('input[type=search]', 'keyup', 'Enter');
  })
});
