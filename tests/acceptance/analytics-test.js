import moment from 'moment';

import { module } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import test from 'ember-sinon-qunit/test-support/test';

import * as uuid from 'uuid/v1';

import config from 'gothamist-web-client/config/environment';
import { ANCESTRY } from '../unit/fixtures/article-fixtures';
import { CMS_TIMESTAMP_FORMAT } from '../../mirage/factories/consts';

function containsText(text) {
  return [...document.querySelectorAll('a')].find(el => el.textContent.includes(text))
}

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

    const TAGS = [{name: 'foo', slug: 'foo'}, {name: 'bar', slug: 'bar'}, {name: 'baz', slug: 'baz'}];
    const AUTHOR_FIRST = 'Foo';
    const AUTHOR_LAST = 'Bar';
    const SECTION = 'News';
    const TITLE = 'Hello World';
    server.create('article', 'withGallery', 'withSection', {
      id: 'gallery',
      related_authors: [{
        first_name: AUTHOR_FIRST,
        last_name: AUTHOR_LAST,
      }],
      publication_date: moment.utc('2019-01-01 12:00').format(CMS_TIMESTAMP_FORMAT),
      ancestry: ANCESTRY,
      tags: TAGS,
      title: TITLE,
      section: 'news',
    });

    await visit('/');

    assert.ok(spyLayer.push.calledWith({IDCustomEvents: BROWSER_ID}), 'browser ID is set');
    assert.ok(spyLayer.push.calledWith({sessionID: 1}), 'session ID is set');

    assert.ok(spyLayer.push.calledWith({template: 'homepage'}), 'homepage template is declared');

    assert.ok(spyLayer.push.calledWith({'event': 'optimize.activate'}), 'datalayer push should be called with optimize.activate event');

    await click('[data-test-top-nav] [data-test-nav-link="0"]'); // news section
    assert.ok(spyLayer.push.calledWith({template: 'section'}), 'section template is declared');

    // remove popular for now
    // await click('[data-test-top-nav] [data-test-nav-link="3"]'); // popular "dimension"
    // assert.ok(spyLayer.push.calledWith({template: 'dimension'}), 'dimension template is declared');

    await click(containsText(('Staff'))); // staff
    assert.ok(spyLayer.push.calledWith({template: 'flatpage'}), 'flatpage template is declared');

    await visit('/search');
    assert.ok(spyLayer.push.calledWith({template: 'search'}), 'search template is declared');

    // await visit('/does-not-exist');
    // assert.ok(spyLayer.push.calledWith({template: '404'}), '404 template is declared');

    await visit('/');
    spyLayer.push.resetHistory();

    await click('[data-test-block="gallery"] a'); // article with a gallery

    assert.deepEqual(spyLayer.push.getCall(1).args[0], {
      articleTags: TAGS.mapBy('name').join(','),
      articleAuthors: `${AUTHOR_FIRST} ${AUTHOR_LAST}`,
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

    assert.ok(spyLayer.push.calledWith({template: 'article gallery'}), 'gallery template is declared');
  });
});
