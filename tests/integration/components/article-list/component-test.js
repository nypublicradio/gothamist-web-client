import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | article-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const ARTICLES = [{
      title: 'foo',
      hasMain: true,
      id: 1,
    }, {
      title: 'bar',
      id: 2,
    }];

    this.set('articles', ARTICLES);
    await render(hbs`
      <ArticleList @articles={{articles}} />
    `);

    assert.dom('[data-test-nypr-block]').exists({count: 2});
  });
});
