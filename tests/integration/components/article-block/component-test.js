import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { FALLBACK_THUMBNAIL } from 'gothamist-web-client/components/article-block/component';

module('Integration | Component | article-block', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const GOTHAMIST_ITEM = {
      title: 'Article Title',
      excerptPretty: 'Summary of the article',
      section: {label: 'News', basename: 'news'},
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
    assert.dom('.c-block__media img').hasAttribute('src', GOTHAMIST_ITEM.thumbnail640, 'respects @thumbnailSize argument');
    assert.dom('.c-block__dek').doesNotExist('respects the @hideExcerpt argument');
  });

  test('fallback images', async function(assert) {
    const GOTHAMIST_ITEM = {
      title: 'Article Title',
      excerptPretty: 'Summary of the article',
      section: {label: 'News', basename: 'news'},
    };

    this.set('item', GOTHAMIST_ITEM);
    await render(hbs`<ArticleBlock @article={{item}} @thumbnailSize='105'/>`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL.news.srcS, 'uses fallback based on section: news');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL.news.srcSet, 'uses fallback based on section: news');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL.news.srcM, 'uses fallback based on section: news');

    this.set('item.section.basename', 'food');
    await render(hbs`<ArticleBlock @article={{item}} @thumbnailSize='105'/>`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL.food.srcS, 'uses fallback based on section: food');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL.food.srcSet, 'uses fallback based on section: food');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL.food.srcM, 'uses fallback based on section: food');

    this.set('item.section.basename', 'arts & entertainment');
    await render(hbs`<ArticleBlock @article={{item}} @thumbnailSize='105'/>`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL['arts & entertainment'].srcS, 'uses fallback based on section: arts');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL['arts & entertainment'].srcSet, 'uses fallback based on section: arts');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL['arts & entertainment'].srcM, 'uses fallback based on section: arts');

    this.set('item.section.basename', undefined);
    await render(hbs`<ArticleBlock @article={{item}} @thumbnailSize='105'/>`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL[undefined].srcS, 'no category src');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL[undefined].srcSet, 'no category srcset');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL[undefined].srcM, 'no category medium src');
  });

});
