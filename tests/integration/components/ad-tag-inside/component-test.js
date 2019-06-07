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
    assert.dom('[data-test-inserted-ad]').exists()
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
    assert.dom('[data-test-inserted-ad]').exists()
  });

  test('it still has an ad after updating the contents', async function(assert) {
    this.set('id','foo');
    await render(hbs`
      {{#ad-tag-inside contentsId=id}}
        <div class='c-article__body'>
          template block text
        </div>
      {{/ad-tag-inside}}
    `);

    assert.dom('.c-article__body #inserted-ad .ad-tag-wide').exists()
    assert.dom('[data-test-inserted-ad]').exists()

    this.element.querySelector('.c-article__body').innerHTML = `completely new article`;
    this.set('id', 'bar');

    assert.dom('.c-article__body #inserted-ad .ad-tag-wide').exists()
    assert.dom('[data-test-inserted-ad]').exists()
  });
});
