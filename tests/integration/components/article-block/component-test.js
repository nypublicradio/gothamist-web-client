import moment from 'moment';

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import {
  JUST_NOW,
  RECENT,
  TIMESTAMP_FORMAT,
} from 'gothamist-web-client/components/article-block/component';

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
    assert.dom('.c-block__media img').hasAttribute('src', GOTHAMIST_ITEM.thumbnail640, 'respects @thumbnailSize argument');
    assert.dom('.c-block__dek').doesNotExist('respects the @hideExcerpt argument');
  });

  test('timestamp', async function(assert) {
    const timestamp = moment();
    const GOTHAMIST_ITEM = {
      publishedMoment: timestamp,
    };
    this.set('article', GOTHAMIST_ITEM);

    timestamp.subtract(1, 'minutes');
    await render(hbs`
      <ArticleBlock @article={{article}}/>
    `);
    assert.dom('[data-test-timestamp]').hasText(JUST_NOW);

    timestamp.subtract(30, 'minutes');
    await render(hbs`
      <ArticleBlock @article={{article}}/>
    `);
    assert.dom('[data-test-timestamp]').hasText(RECENT);

    timestamp.subtract(29, 'minutes');
    await render(hbs`
      <ArticleBlock @article={{article}}/>
    `);
    assert.dom('[data-test-timestamp]').hasText("1 hour ago");

    timestamp.subtract(1, 'hours');
    await render(hbs`
      <ArticleBlock @article={{article}}/>
    `);
    assert.dom('[data-test-timestamp]').hasText("2 hours ago");

    timestamp.subtract(1, 'day');
    await render(hbs`
      <ArticleBlock @article={{article}}/>
    `);
    assert.dom('[data-test-timestamp]').hasText(timestamp.format(TIMESTAMP_FORMAT));
  })
});
