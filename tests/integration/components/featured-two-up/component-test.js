import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import moment from 'moment'
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | featured-two-up', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const articles = [
      {
        title: 'Article 1',
        description: 'Summary 1',
        publishedMoment: moment(),
        thumbnail: {
          id: 100,
        },
        section: {
          slug: 'news',
          title: 'News',
        }
      },
      {
        title: 'Article 2',
        description: 'Summary 2',
        publishedMoment: moment(),
        thumbnail: {
          id: 100,
        },
        section: {
          slug: 'food',
          title: 'Food',
        }
      }
    ];
    this.set('articles', articles);

    await render(hbs`<FeaturedTwoUp @articles={{articles}} />`);

    let articleElements = this.element.querySelectorAll('.c-block')

    assert.dom('.c-block__eyebrow', articleElements[0]).containsText('News')
    assert.dom('[data-test-block-title]', articleElements[0]).containsText('Article 1')
    assert.dom('.c-block__dek', articleElements[0]).containsText('Summary 1')
    assert.dom('[data-test-timestamp]', articleElements[0]).containsText('Just now')

    assert.dom('.c-block__eyebrow', articleElements[1]).containsText('Food')
    assert.dom('[data-test-block-title]', articleElements[1]).containsText('Article 2')
    assert.dom('.c-block__dek', articleElements[1]).containsText('Summary 2')
    assert.dom('[data-test-timestamp]', articleElements[1]).containsText('Just now')
  });
});
