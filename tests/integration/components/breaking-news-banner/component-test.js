import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | breaking-news-banner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<BreakingNewsBanner/>`);
    assert.dom('.o-text-banner').exists({count: 1});
  });

  test('it displays the news details', async function(assert) {
    const NEWS = {
      title: 'test title',
      description: 'test description',
      link: 'http://abc.def'
    }

    this.set('news', NEWS);

    await render(hbs`<BreakingNewsBanner @news={{news}}/>`);

    assert.dom('.o-text-banner').exists({count: 1});
    assert.dom('.o-text-banner .c-block__title').containsText(NEWS.title);
    assert.dom('.o-text-banner .c-block__dek').containsText(NEWS.description);
  });
});
