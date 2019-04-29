import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | article-block', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const GOTHAMIST_ITEM = {
      title: 'Article Title',
      excerptPretty: 'Summary of the article',
      section: 'News',
      thumbnail105: 'https://example.com/small.jpeg',
      thumbnail640: 'https://example.com/big.jpeg',
    };

    this.set('item', GOTHAMIST_ITEM);
    await render(hbs`
      <ArticleBlock @article={{item}} @thumbnailSize='105'/>
    `);

    assert.dom('.c-block__media img').hasAttribute('src', GOTHAMIST_ITEM.thumbnail105);
    assert.dom('.c-block__title').hasText(GOTHAMIST_ITEM.title);
    assert.dom('.c-block__dek').hasText(GOTHAMIST_ITEM.excerptPretty);

    await render(hbs`
      <ArticleBlock @article={{item}} @thumbnailSize='640' @hideExcerpt={{true}}/>
    `);
    assert.dom('.c-block__media img').hasAttribute('src', GOTHAMIST_ITEM.thumbnail640);
    assert.dom('.c-block__dek').doesNotExist();
  });
});
