import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { wagtailImageUrl } from 'ember-wagtail-images/helpers/wagtail-image-url';

module('Integration | Component | article-body', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ArticleBody/>`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it handles unknonwn types', async function(assert) {
    const BODY = [{
      type: 'foo',
    }];

    this.set('body', BODY);
    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.ok('can render without exception if it encounters a type without a corresponding component');
  });

  test('it handles paragraph types', async function(assert) {
    const BODY = [{
      type: 'paragraph',
      value: '<p>hello world!</p>',
      id: 'abcd-12354',
    }];

    this.set('body', BODY);

    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.dom('p').hasText('hello world!');
  });

  test('it handles images', async function(assert) {
    const BODY = [{
      type: 'image',
      value: {
        image: {
          id: 123,
          width: 1000,
          height: 2000,
        },
        caption: 'hello there'
      },
      id: 'abcde-1325'
    }];

    const EXPECTED_WIDTH = 634;
    const EXPECTED_HEIGHT = Math.round((EXPECTED_WIDTH * 2000) / 1000)
    const EXPECTED_URL = wagtailImageUrl([{id: 123}, EXPECTED_WIDTH, EXPECTED_HEIGHT]);

    this.set('body', BODY);

    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.dom('.o-figure .o-picture img').hasAttribute('src', EXPECTED_URL, 'image blocks are rendered at 630px across');
  });

  test('it handles headings', async function(assert) {
    const HEADING = 'foo';
    const BODY = [{
      type: 'heading',
      value: HEADING,
      id: '1324-abcde'
    }];

    this.set('body', BODY);

    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.dom('h3').hasText(HEADING, 'headings are rendered as an h3');
  });


  test('it handles code', async function(assert) {
    const BODY = [{
      type: 'code',
      value: {
        title: 'some title',
        code: `
          <div id="foo"/>
          <script>document.getElementById("foo").textContent="hello world";</script>
        `,
      },
      id: 'abcd-12355',
    }];

    this.set('body', BODY);
    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.dom('#foo').hasText('hello world');
  });

  test('it handles embeds', async function(assert) {
    const BODY = [{
      type: 'embed',
      value: {
        embed: `
          <div>
            <span id="embed" />
            <script>document.getElementById("embed").textContent="embedded";</script>
          </div>
        `
      }
    }];

    this.set('body', BODY);
    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.dom('#embed').hasText('embedded');
  });

  test('it handles block quotes', async function(assert) {
    const BODY = [{
      type: 'block_quote',
      value: {
        block_quote: "Long Quote No Big Deal",
      }
    }];

    this.set('body', BODY);
    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.dom('blockquote > p').hasText('Long Quote No Big Deal');
  });

  test('it handles pull quotes', async function(assert) {
    const BODY = [{
      type: 'pull_quote',
      value: {
        pull_quote: "Long Quote No Big Deal",
        attribution: "Sally Ride",
      }
    }];

    this.set('body', BODY);
    await render(hbs`<ArticleBody @blocks={{body}} />`);

    assert.dom('blockquote.o-pullquote > p > span').hasText('Long Quote No Big Deal');
    assert.dom('blockquote.o-pullquote > .o-pullquote__author').hasText('Sally Ride');
  });

  // test('it handles documents');

});
