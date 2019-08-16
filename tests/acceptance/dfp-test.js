import * as googletag from 'googletag';

import { module } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import test from 'ember-sinon-qunit/test-support/test';

const PUB_ADS_STUB = {
  addEventListener() {},
  clear() {},
  clearTargeting() {},
  setTargeting() {},
};

const MAPPING_STUB = {
  addSize() {},
  build() {},
};

const AD_STUB = {
  defineSizeMapping() {},
  addService() {}
};

const DFP_STUB = () => ({
  cmd: [],
  pubads: () => PUB_ADS_STUB,
  defineSlot: () => AD_STUB,
  sizeMapping: () => MAPPING_STUB,
  display() {},
  destroySlots() {},
})

module('Acceptance | dfp', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;

    googletag.default = DFP_STUB();
  });

  hooks.afterEach(() => {
    window.block_disqus = false;

    googletag.default = {cmd: []};
  });

  test('provocative articles should pass racy to DFP', async function(assert) {
    this.stub(googletag.default.cmd, 'push').callsArg(0);
    const targetingSpy = this.spy(PUB_ADS_STUB, 'setTargeting');

    const article = server.create('article', {provocative_content: true});
    await visit(article.html_path);

    assert.ok(targetingSpy.calledWith('racy', 'true'), 'should pass racy as the literal string "true" to conform with DFP expectations');
  });

  test('article should pass their tags, sections, and template type to DFP', async function(assert) {
    this.stub(googletag.default.cmd, 'push').callsArg(0);
    const targetingSpy = this.spy(PUB_ADS_STUB, 'setTargeting');

    const article = server.create('article', {tags: ['foo', 'bar'], section: 'news'});

    await visit(article.html_path);

    assert.ok(targetingSpy.calledWith('tags', ['foo', 'bar']), 'should pass in article tags');
    assert.ok(targetingSpy.calledWith('Category', 'news'), 'should pass section slug');
    assert.ok(targetingSpy.calledWith('Template', 'Article'), 'should pass template');
  });

  test('sensitive articles should not render ads', async function(assert) {
    const sensitive = server.create('article', {sensitive_content: true, show_as_feature: true});
    const numb = server.create('article', {show_as_feature: true});

    this.stub(googletag.default.cmd, 'push').callsArg(0);

    const defineSpy = this.spy(googletag.default, 'defineSlot');

    await visit('/');

    const HOMEPAGE_ADS = defineSpy.callCount;

    await click(`[data-test-block="${sensitive.id}"] a`);

    assert.equal(currentURL(), `/${sensitive.section}/${sensitive.meta.slug}`);

    assert.equal(defineSpy.callCount, HOMEPAGE_ADS, 'no additional ads should be called on sensitive articles');

    await click('[data-test-header-logo]'); // back to homepage

    assert.equal(defineSpy.callCount, HOMEPAGE_ADS * 2, 'only ads defined should be those on homepage');

    await click(`[data-test-block="${numb.id}"] a`);

    assert.ok(defineSpy.callCount > HOMEPAGE_ADS * 2, 'non-sensitive articles should call ads after a sensitive ad');
  })
});
