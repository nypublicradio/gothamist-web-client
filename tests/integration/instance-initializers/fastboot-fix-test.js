import { prepDomForFastBoot } from 'gothamist-web-client/instance-initializers/fastboot-fix';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Instance Initializer | fastboot-fix', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it ensures fastboot markers have the same parent', async function(assert) {
    const BAD_BODY = `
      <script type="x/boundary" id="fastboot-body-start"></script>
      <div>
        <p>
          Great article content here.
        </p>
        <em>With additional reporting<em>
      </div>
      <script type="x/boundary" id="fastboot-body-end"></script>
    `;
    this.set('BAD_BODY', BAD_BODY);

    await render(hbs`{{{BAD_BODY}}}`);

    prepDomForFastBoot();

    let startMarker = this.element.querySelector('#fastboot-body-start');
    let endMarker = this.element.querySelector('#fastboot-body-end');
    assert.deepEqual(startMarker.parentElement, endMarker.parentElement);
  });
});
