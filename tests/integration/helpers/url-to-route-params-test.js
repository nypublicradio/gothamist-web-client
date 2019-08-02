import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | url-to-route-params', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('url', '/author/authorname');

    await render(hbs`{{url-to-route-params url}}`);

    assert.equal(this.element.textContent.trim(), 'author-detail,authorname');
  });
});
