import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | slide-sizes', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('slides', [{
      image: {
        id: 100,
        caption: 'foo'
      }
    }, {
      image: {
        id: 200,
        caption: 'bar'
      }
    }]);

    await render(hbs`{{slide-sizes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1234');
  });
});
