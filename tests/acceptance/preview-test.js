import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
// import config from '../../config/environment';

module('Acceptance | preview', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting preview article', async function(assert) {
    let identifier = 'preview';
    let token = '123';
    let url = `/preview?identifier=${identifier}&token=${token}`;
    let slug = `${identifier}-${token}`;
    let article = server.create('article',{slug, text: 'foo'})

    await visit(url);

    assert.equal(currentURL(), url);
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText('foo');
    assert.dom('[data-test-article-body] [data-test-inserted-ad]').exists({count: 1})
  });
});
