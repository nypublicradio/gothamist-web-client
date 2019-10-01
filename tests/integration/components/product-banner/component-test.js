import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | product-banner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ProductBanner/>`);
    assert.dom('.o-box-banner').exists({count: 1});
  });

  test('it displays the news details', async function(assert) {
    const BANNER = {
      title: 'test title',
      description: 'test description',
      link: 'http://abc.def'
    }

    this.set('banner', BANNER);

    await render(hbs`<ProductBanner @banner={{banner}}/>`);

    assert.dom('.o-box-banner').exists({count: 1});
    assert.dom('.o-box-banner__title').containsText(BANNER.title);
    assert.dom('.o-box-banner__dek').containsText(BANNER.description);
  });
});

