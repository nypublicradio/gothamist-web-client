import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | article-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const article = {
      title: 'foo',
      permalink: 'http://example.com',
      authorNickname: 'bar baz',
      excerptPretty: 'biz buz',
    };

    this.set('article', article);
    await render(hbs`{{article-card article=article}}`);

    assert.dom('h3').hasText(article.title);
    assert.dom('p').hasText(article.authorNickname);

    assert.dom('article').includesText(article.excerptPretty);
  });
});
