import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | story-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const STORY = {
      title: 'foo',
      permalink: 'http://example.com',
      authorNickname: 'bar baz',
      excerptPretty: 'biz buz',
    };

    this.set('story', STORY);
    await render(hbs`{{story-card story=story}}`);

    assert.dom('h3').hasText(STORY.title);
    assert.dom('p').hasText(STORY.authorNickname);

    assert.dom('article').includesText(STORY.excerptPretty);
  });
});
