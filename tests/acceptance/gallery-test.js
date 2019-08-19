import { module, test } from 'qunit';
import { visit, currentURL, find, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { scrollPastHeader } from 'nypr-design-system/test-support';


module('Acceptance | gallery', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;
  });

  hooks.afterEach(() => {
    window.block_disqus = false;
  });

  test('can navigate from an article to a gallery', async function(assert) {
    const article = server.create('article', 'withGallery');
    let { slides } = article.gallery;

    await visit(article.html_path);

    assert.dom('[data-test-gallery-lead]').exists();
    // mirage defualt is 5 slides per gallery
    assert.dom('[data-test-gallery-lead-view-all]').hasText('View all 8')

    let preview = find('[data-test-gallery-lead-preview] img');
    assert.ok(preview.src.match(`images/${slides[0].value.slide_image.image.id}/fill-625x416`), 'preview image has expected URL')

    await click('[data-test-gallery-thumb="1"]');
    assert.ok(preview.src.match(`images/${slides[1].value.slide_image.image.id}/fill-625x416`), 'preview image is updated to new image')

    await click('[data-test-gallery-lead-view-all]');

    assert.equal(currentURL(), `/${article.gallery.html_path.slice(0, -1)}`, 'should navigate to gallery');

    assert.dom('[data-test-gallery-title]').hasText(article.title);

    await click('.o-back-to-link');

    assert.equal(currentURL(), `/${article.html_path.slice(0, -1)}`, 'should be back on article');

    await click('[data-test-gallery-thumb="3"]');
    await click('[data-test-gallery-current]');

    assert.equal(
      currentURL(),
      `/${article.gallery.html_path.slice(0, -1)}?image=3`,
      'should navigate to previewed slide'
    );

    let reset = await scrollPastHeader(this);
    await click('[data-test-header-close]');

    assert.equal(currentURL(), `/${article.html_path.slice(0, -1)}`, 'should be back on article');

    reset();
  });

  test('gallery should have the expected images', async function(assert) {
    const gallery = server.create('gallery');
    await visit(gallery.html_path);

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

  test('gallery should contain 2 slides and 0 ads', async function(assert) {
    const gallery = server.create('gallery', {count: 2});

    await visit(gallery.html_path);

    // do a match to guard against non-determinism with ?image query string
    assert.ok(currentURL().match(`${gallery.html_path}`), 'path should include gallery');
    assert.dom('[data-test-gallery-slide]').exists({count: 2});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 0});
  });

  test('gallery should contain 3 slides and 1 ad', async function(assert) {
    const gallery = server.create('gallery', {count: 3});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 3});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 1});
  });

  test('gallery should contain 5 slides and 1 ads', async function(assert) {
    const gallery = server.create('gallery', {count: 5});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 5});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 1});
  });


  test('gallery should contain 6 slides and 2 ads', async function(assert) {
    const gallery = server.create('gallery', {count: 6});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 6});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 2});
  });

  test('gallery should contain 14 slides and still only 2 ads', async function(assert) {
    const gallery = server.create('gallery', {count: 14});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 14});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 2});
  });
});
