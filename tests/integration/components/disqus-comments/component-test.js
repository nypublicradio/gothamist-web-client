import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Component | disqus-comments', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    window.DISQUS = {reset() {}};
  })

  test('it calls reset if the script is present', async function() {
    var fakeScript = document.createElement('script');
    fakeScript.id = 'disqus-lib';
    document.head.appendChild(fakeScript);

    this.mock(window.DISQUS)
      .expects('reset')
      .once();

    await render(hbs`<DisqusComments/>`);

    document.head.removeChild(fakeScript);
  });
});
