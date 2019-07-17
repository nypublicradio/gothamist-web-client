import moment from 'moment';

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { FALLBACK_THUMBNAIL } from 'gothamist-web-client/components/article-block/component';
import config from 'gothamist-web-client/config/environment';
import { TIMESTAMP_FORMAT_NO_YEAR } from 'gothamist-web-client/helpers/timestamp';

module('Integration | Component | article-block', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const recent = moment().subtract(1, 'day');
    const IMAGE_ID = 100;
    const GOTHAMIST_ITEM = {
      title: 'Article Title',
      description: 'Summary of the article',
      publishedMoment: recent,
      thumbnail: {
        id: IMAGE_ID,
      }
    };

    const EXPECTED_URL = `${config.APP.wagtailImages.imagePath}/${IMAGE_ID}/fill-640x300/`;

    this.set('item', GOTHAMIST_ITEM);
    await render(hbs`
      <ArticleBlock
        @article={{item}}
        @thumbnailSize={{array 640 300}}
      />
    `);

    assert.dom('.c-block__media img').hasAttribute('src', EXPECTED_URL, 'thumbnail is generated');

    assert.dom('.c-block__title').hasText(GOTHAMIST_ITEM.title);
    assert.dom('.c-block__dek').hasText(GOTHAMIST_ITEM.description);

    assert.dom('[data-test-timestamp]').hasText(recent.format(TIMESTAMP_FORMAT_NO_YEAR));

    await render(hbs`
      <ArticleBlock
        @article={{item}}
        @thumbnailSize={{array 640 300 true}}
        @mediumThumbnailSize={{array 1000 200}}
        @hideExcerpt={{true}}
      />
    `);
    assert.dom('.c-block__media img').hasAttribute('srcset', new RegExp(EXPECTED_URL), 'using a boolean in the third index renders high-dpi srcset');
    assert.dom('.c-block__media source').exists('creates a source element when medium thumbnail sizes are provided')
    assert.dom('.c-block__dek').doesNotExist('respects the @hideExcerpt argument');
  });

  test('fallback images', async function(assert) {
    const GOTHAMIST_ITEM = {
      title: 'Article Title',
      description: 'Summary of the article',
      section: {label: 'News', basename: 'news'},
    };

    this.set('item', GOTHAMIST_ITEM);
    await render(hbs`<ArticleBlock @article={{item}} />`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL.news.srcS, 'uses fallback based on section: news');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL.news.srcSet, 'uses fallback based on section: news');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL.news.srcM, 'uses fallback based on section: news');

    this.set('item.section.basename', 'food');
    await render(hbs`<ArticleBlock @article={{item}} />`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL.food.srcS, 'uses fallback based on section: food');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL.food.srcSet, 'uses fallback based on section: food');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL.food.srcM, 'uses fallback based on section: food');

    this.set('item.section.basename', 'arts & entertainment');
    await render(hbs`<ArticleBlock @article={{item}} />`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL['arts & entertainment'].srcS, 'uses fallback based on section: arts');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL['arts & entertainment'].srcSet, 'uses fallback based on section: arts');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL['arts & entertainment'].srcM, 'uses fallback based on section: arts');

    this.set('item.section.basename', undefined);
    await render(hbs`<ArticleBlock @article={{item}} />`);

    assert.dom('.c-block__media img').hasAttribute('src', FALLBACK_THUMBNAIL[undefined].srcS, 'no category src');
    assert.dom('.c-block__media img').hasAttribute('srcset', FALLBACK_THUMBNAIL[undefined].srcSet, 'no category srcset');
    assert.dom('.c-block__media source').hasAttribute('srcset', FALLBACK_THUMBNAIL[undefined].srcM, 'no category medium src');
  });
});
