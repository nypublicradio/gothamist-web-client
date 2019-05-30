import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';


const oneHundredWords = new Array(50).fill('dummy text ').join('');

module('Integration | Component | ad-tag-inside', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.oneHundredWords = oneHundredWords;
  });

  test('it renders in an article', async function(assert) {
    await render(hbs`
      {{#ad-tag-inside}}
        <div class='c-article__body'>
          template block text
        </div>
      {{/ad-tag-inside}}
    `);

    assert.dom('.c-article__body #inserted-ad .ad-tag-wide').exists()
    assert.dom('[id^=ad_]').exists()
  });

  test('it renders in the specified container', async function(assert) {
    await render(hbs`
      {{#ad-tag-inside containerSelector='.special-div'}}
        <div class='special-div'>
          template block text
        </div>
      {{/ad-tag-inside}}
    `);

    assert.dom('.special-div #inserted-ad .ad-tag-wide').exists()
    assert.dom('[id^=ad_]').exists()
  });

});
