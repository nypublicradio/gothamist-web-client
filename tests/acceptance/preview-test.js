import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | preview', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;
  });

  hooks.afterEach(() => {
    window.block_disqus = false;
  });

  test('visiting preview article', async function(assert) {
    let identifier = 'preview';
    let token = '123';
    let url = `/preview?identifier=${identifier}&token=${token}`;

    // this is a fake article, to make sure the test is hitting the
    // preview api and not pulling from the articles api
    server.create('article', {text: 'bar', slug: 'test' });

    // this is the preview article. mirage will serve it from the preview
    // api because it has an identifier and token
    let article = server.create('article', {identifier, token, text: 'foo', slug: 'test' })

    await visit(url);

    assert.equal(currentURL(), url);
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText('foo');
    assert.dom('[data-test-article-body] [data-test-inserted-ad]').exists({count: 1})
  });
});
