import * as htlbid from 'htlbid';

import { module } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import test from 'ember-sinon-qunit/test-support/test';

const HTL_STUB = () => ({
  cmd: {
    push: fn => fn(), // force function queue to run
  },
  addEventListener() {},
  clearTargeting() {},
  setTargeting() {},
  on() {},
})

let original = htlbid.default

module('Acceptance | dfp', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.block_disqus = true;

    htlbid.default = HTL_STUB();
  });

  hooks.afterEach(() => {
    window.block_disqus = false;

    htlbid.default = original;
  });

  test('provocative articles should pass racy to DFP', async function(assert) {
    const targetingSpy = this.spy(htlbid.default, 'setTargeting');

    const article = server.create('article', {provocative_content: true});
    await visit(article.html_path);

    assert.ok(targetingSpy.calledWith('racy', 'true'), 'should pass racy as the literal string "true" to conform with DFP expectations');
  });

  test('article should pass their tags, sections, and template type to DFP', async function(assert) {
    const targetingSpy = this.spy(htlbid.default, 'setTargeting');

    const article = server.create('article', {tags: [{slug: 'foo', name: 'foo'}, {slug: 'bar', name: 'bar'}], section: 'news'});

    await visit(article.html_path);

    assert.ok(targetingSpy.calledWith('tags', ['foo', 'bar']), 'should pass in article tags');
    assert.ok(targetingSpy.calledWith('Category', 'news'), 'should pass section slug');
    assert.ok(targetingSpy.calledWith('Template', 'Article'), 'should pass template');
  });

  // test('sensitive articles should not render ads', async function(assert) {
  //   const sensitive = server.create('article', {sensitive_content: true, show_as_feature: true});
  //   const numb = server.create('article', {show_as_feature: true});

  //   const defineSpy = this.spy(googletag.default, 'defineSlot');

  //   await visit('/');

  //   const HOMEPAGE_ADS = defineSpy.callCount;

  //   await click(`[data-test-block="${sensitive.id}"] a`);

  //   assert.equal(currentURL(), `/${sensitive.section}/${sensitive.meta.slug}`);

  //   assert.equal(defineSpy.callCount, HOMEPAGE_ADS, 'no additional ads should be called on sensitive articles');

  //   await click('[data-test-header-logo]'); // back to homepage

  //   assert.equal(defineSpy.callCount, HOMEPAGE_ADS * 2, 'only ads defined should be those on homepage');

  //   await click(`[data-test-block="${numb.id}"] a`);

  //   assert.ok(defineSpy.callCount > HOMEPAGE_ADS * 2, 'non-sensitive articles should call ads after a sensitive ad');
  // });

  test('sponsored articles should pass their sponsor name to DFP', async function(assert) {
    const targetingSpy = this.spy(htlbid.default, 'setTargeting');

    const SPONSOR_1 = "NYC Wine & Food Festival";
    const SPONSOR_2 = "Volvo";

    let article = server.create('article', {
      related_sponsors: [{
        id: 3,
        link: "https://nycwff.org/",
        name: SPONSOR_1,
      }],
    });
    await visit(article.html_path);

    assert.ok(targetingSpy.calledWith('Sponsor', SPONSOR_1), 'should pass in related sponsor names');

    article = server.create('article', {
      related_sponsors: [{
        id: 3,
        link: "https://nycwff.org/",
        name: SPONSOR_1,
      }, {
        id: 5,
        link: "https://volvo.com",
        name: SPONSOR_2,
      }],
    });
    await visit(article.html_path);

    assert.ok(
      targetingSpy.calledWith('Sponsor', [SPONSOR_1, SPONSOR_2].join(',')),
      'multiple sponsors should be separated by comma'
    );
  });
});
