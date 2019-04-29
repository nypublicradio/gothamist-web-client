import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | wnyc-block', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const WNYC_ITEM = {
      'image-main': {
        template: 'https://example.com/i/%s/%s/%s/%s/test.jpeg'
      },
      title: 'Article Title',
      tease: 'Summary of the article',
    };
    this.set('story', WNYC_ITEM);

    await render(hbs`
      <WnycBlock @story={{story}}/>
    `);

    assert.dom('.c-block__media img').hasAttribute('src', 'https://example.com/i/80/0/c/80/test.jpeg');
    assert.dom('.c-block__title').hasText(WNYC_ITEM.title);
    assert.dom('.c-block__dek').hasText(WNYC_ITEM.tease);

    await render(hbs`
      <WnycBlock @story={{story}} @hideExcerpt={{true}}/>
    `);
    assert.dom('.c-block__dek').doesNotExist();
  });
});
