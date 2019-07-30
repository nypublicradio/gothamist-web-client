import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';


module('Acceptance | gallery', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;
  });

  hooks.afterEach(() => {
    window.block_disqus = false;
  })

  test('gallery should contain 2 slides and 0 ads', async function(assert) {
    const gallery = server.create('gallery', {section: 'food', count: 2});

    await visit(`/${gallery.html_path}`);

    // do a match to guard against non-determinism with ?image query string
    assert.ok(currentURL().match(`${gallery.html_path}`), 'path should include gallery');
    assert.dom('[data-test-gallery-slide]').exists({count: 2});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 0});
  });

  test('gallery should contain 3 slides and 1 ad', async function(assert) {
    const gallery = server.create('gallery', {section: 'food', count: 3});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 3});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 1});
  });

  test('gallery should contain 5 slides and 1 ads', async function(assert) {
    const gallery = server.create('gallery', {section: 'food', count: 5});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 5});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 1});
  });


  test('gallery should contain 6 slides and 2 ads', async function(assert) {
    const gallery = server.create('gallery', {section: 'food', count: 6});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 6});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 2});
  });

  test('gallery should contain 14 slides and still only 2 ads', async function(assert) {
    const gallery = server.create('gallery', {section: 'food', count: 14});

    await visit(gallery.html_path);

    assert.equal(currentURL(), gallery.html_path);
    assert.dom('[data-test-gallery-slide]').exists({count: 14});
    assert.dom('[data-test-gallery-overlay] [data-test-ad-tag-wide]').exists({count: 2});
  });
});
