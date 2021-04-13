import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import moment from 'moment';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | featured-one-up', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    const article = {
      title: 'Article Title',
      description: 'Summary of the article',
      publishedMoment: moment(),
      thumbnail: {
        id: 100,
      },
      section: {
        slug: 'news',
        title: 'News',
      }
    };

    this.set('article', article);

    await render(hbs`<FeaturedOneUp @article={{article}} />`);

    assert.dom('.c-block__eyebrow').containsText('News')
    assert.dom('[data-test-block-title]').containsText('Article Title')
    assert.dom('.c-block__dek').containsText('Summary of the article')
    assert.dom('[data-test-timestamp]').containsText('Just now')
  });
});
