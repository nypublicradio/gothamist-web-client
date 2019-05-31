import { module } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import test from 'ember-sinon-qunit/test-support/test';

import * as uuid from 'uuid/v1';

import config from 'gothamist-web-client/config/environment';


module('Acceptance | analytics', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;
  });

  hooks.afterEach(() => {
    window.block_disqus = false;
  });

  test('dataLayer values', async function(assert) {
    this.stub(uuid, 'default').returns(1);

    const BROWSER_ID = 'foo';
    server.get(config.etagAPI, {browser_id: BROWSER_ID});

    const dataLayer = this.owner.lookup('service:nypr-metrics/data-layer');
    const spyLayer = {push: this.spy()};
    this.stub(dataLayer, 'getDataLayer').returns(spyLayer);

    const TAGS = ['foo', 'bar', 'baz'];
    const AUTHOR = 'Foo Bar';
    const SECTION = 'News';
    const TITLE = 'Hello World';
    server.create('article', 'mtGallery', {
      id: 'gallery',
      author_nickname: AUTHOR,
      authored_on_utc: '20190101120000',
      categories: [{
        basename: 'news',
        label: SECTION
      }],
      tags: TAGS,
      title: TITLE,
    });

    await visit('/');

    assert.ok(spyLayer.push.calledWith({IDCustomEvents: BROWSER_ID}), 'browser ID is set');
    assert.ok(spyLayer.push.calledWith({sessionID: 1}), 'session ID is set');

    assert.ok(spyLayer.push.calledWith({template: 'homepage'}), 'homepage template is declared');

    await click('[data-test-top-nav] [data-test-nav-link="0"]'); // news section
    assert.ok(spyLayer.push.calledWith({template: 'section'}), 'section template is declared');

    await click('[data-test-top-nav] [data-test-nav-link="3"]'); // popular "dimension"
    assert.ok(spyLayer.push.calledWith({template: 'dimension'}), 'dimension template is declared');

    await click('[data-test-main-footer] [data-test-secondary-nav-link="1"]'); // contact us
    assert.ok(spyLayer.push.calledWith({template: 'flatpage'}), 'flatpage template is declared');

    await click('[data-test-main-footer] [data-test-secondary-nav-link="4"]'); // staff
    assert.ok(spyLayer.push.calledWith({template: 'flatpage'}), 'flatpage template is declared');

    await visit('/search');
    assert.ok(spyLayer.push.calledWith({template: 'search'}), 'search template is declared');

    await visit('/does-not-exist');
    assert.ok(spyLayer.push.calledWith({template: '404'}), '404 template is declared');

    await visit('/');
    spyLayer.push.resetHistory();

    await click('[data-test-block="gallery"] a'); // article with a gallery

    assert.deepEqual(spyLayer.push.firstCall.args[0], {
      articleTags: TAGS.join(','),
      articleAuthors: AUTHOR,
      articleSection: SECTION,
      articleTitle: TITLE,
      articlePublishTime: '2019-01-01T07:00-05:00', // going from UTC to eastern subtracts 5 hours
    }, 'dataLayer is updated with correct article metadata');

    assert.ok(spyLayer.push.calledWith({template: 'article'}), 'article template is declared');

    spyLayer.push.resetHistory();
    await click('[data-test-article-meta] [data-test-gallery-link]');

    assert.deepEqual(spyLayer.push.firstCall.args[0], {
      articleTags: null,
      articleAuthors: null,
      articleSection: null,
      articleTitle: null,
      articlePublishTime: null,
    }, 'dataLayer is cleared of article metadata on route exit');

    assert.ok(spyLayer.push.calledWith({template: 'article gallery'}), 'article template is declared');
  });
});
