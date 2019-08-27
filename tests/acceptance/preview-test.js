import { module, test } from 'qunit';
import { visit, find, currentURL } from '@ember/test-helpers';
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

  test('visiting preview article with a gallery', async function(assert) {
    let identifier = 'preview';
    let token = '123';
    let url = `/preview?identifier=${identifier}&token=${token}`;

    // this is a fake article, to make sure the test is hitting the
    // preview api and not pulling from the articles api
    server.create('article', {text: 'bar', slug: 'test'});

    // this is the preview article. mirage will serve it from the preview
    // api because it has an identifier and token
    let article = server.create('article', {identifier, token, text: 'foo', slug: 'test' }, 'withGallery')

    await visit(url);

    assert.equal(currentURL(), url);
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText('foo');
    assert.dom('[data-test-article-body] [data-test-inserted-ad]').exists({count: 1});
    assert.dom('[data-test-gallery-lead]').exists();
    // mirage withGallery trait default is 8 slides per gallery
    assert.dom('[data-test-gallery-lead-view-all]').hasText('View all 8');
  });

  test('visiting preview article with a missing gallery', async function(assert) {
    let identifier = 'preview';
    let token = '123';
    let url = `/preview?identifier=${identifier}&token=${token}`;

    // this is a fake article, to make sure the test is hitting the
    // preview api and not pulling from the articles api
    server.create('article', {text: 'bar', slug: 'test'});

    // this is the preview article. mirage will serve it from the preview
    // api because it has an identifier and token
    let article = server.create('article', {identifier, token, text: 'foo', slug: 'test' });
      article.update({
        lead_asset: [{
          type: 'lead_gallery',
          value: {
            gallery: 12345,
            default_image: null,
          },
          id: 'aaaa-bbbb-cccc-dddd',
        }],
        gallery: undefined,
    });
    await visit(url);

    assert.equal(currentURL(), url);
    assert.dom('[data-test-article-headline]').hasText(article.title);
    assert.dom('[data-test-article-body]').hasText('foo');
    assert.dom('[data-test-article-body] [data-test-inserted-ad]').exists({count: 1});
  });

  test('visiting preview gallery', async function(assert) {
    let identifier = 'preview';
    let token = '123';
    let url = `/preview?identifier=${identifier}&token=${token}`;

    let gallery = server.create('gallery', {identifier, token})

    await visit(url);

    gallery.slides.forEach((slide, i) => {
      let { id } = slide.value.slide_image.image;

      let img = find(`[data-test-gallery-slide="${i}"] img`);
      assert.dom(img).hasAttribute('src');

      let src = img.getAttribute('src');
      assert.ok(
        src.match(`images/${id}/width-420`),
        `image src should have expected path: ${src}`
      );

      let mediumSource = find(`[data-test-gallery-slide="${i}"] [data-test-source-m]`);
      assert.ok(
        mediumSource.srcset.match(`images/${id}/width-800`),
        `source srcset should have larger image path: ${mediumSource.srcset}`
      );

      let largeSource = find(`[data-test-gallery-slide="${i}"] [data-test-source-l]`);
      assert.ok(
        largeSource.srcset.match(`images/${id}/width-1200`),
        `source srcset should have larger image path: ${largeSource.srcset}`
      );
    });
  });

});
