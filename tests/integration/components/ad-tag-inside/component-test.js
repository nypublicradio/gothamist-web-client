import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';


const oneHundredWords = new Array(50).fill('dummy text ').join('');

module('Integration | Component | ad-tag-inside', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.oneHundredWords = oneHundredWords;
  });

  test('it renders in an article', async function(assert) {
    let blocks = [{type: "paragraph", value: "<p>some text</p>", id: '100'}]
    this.set('blocks', blocks);
    await render(hbs`
      <AdTagInside as |hooks|>
        <NyprOArticleBody>
          <ArticleBody
            @blocks={{this.blocks}}
            @onDidRender={{hooks.didRender}}
          />
        </NyprOArticleBody>
      </AdTagInside>
    `);

    assert.dom('[data-test-inserted-ad-wrapper]').exists()
    assert.dom('.c-article__body #inserted-ad [data-test-inserted-ad]').exists()
  });

  test('it renders in the specified container', async function(assert) {
    let blocks = [{type: "paragraph", value: "<p>some text</p>", id: '100'}]
    this.set('blocks', blocks);
    await render(hbs`
      <AdTagInside @containerSelector=".special-div" as |hooks|>
        <div class="special-div">
          <ArticleBody
            @blocks={{this.blocks}}
            @onDidRender={{hooks.didRender}}
          />
        </div>
      </AdTagInside>
      `);

    assert.dom('[data-test-inserted-ad-wrapper]').exists()
    assert.dom('.special-div #inserted-ad .ad-tag-wide').exists()
    assert.dom('[data-test-inserted-ad]').exists()
  });

  test('it still has an ad after changing the contents', async function(assert) {
    let blocks = [{type: "paragraph", value: '<p id="foo">some text</p>', id: '200'}]
    this.set('blocks', blocks);
    await render(hbs`
      <AdTagInside as |hooks|>
        <NyprOArticleBody>
          <ArticleBody
            @blocks={{this.blocks}}
            @onDidRender={{hooks.didRender}}
          />
        </NyprOArticleBody>
      </AdTagInside>
    `);

    assert.dom('[data-test-inserted-ad-wrapper]').exists()
    assert.dom('.c-article__body p#foo').exists()
    assert.dom('.c-article__body p#foo + #inserted-ad > [data-test-inserted-ad]').exists()

    let newBlocks = [{type: "paragraph", value: '<p id="bar">different text</p>', id: '201'}]
    this.set('blocks', newBlocks);

    await settled();

    assert.dom('.c-article__body p#bar').exists()
    assert.dom('.c-article__body p#bar + #inserted-ad > [data-test-inserted-ad]').exists()
  });
});
