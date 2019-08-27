import { faker } from 'ember-cli-mirage';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import test from 'ember-sinon-qunit/test-support/test';


const ARTICLE = {
  id: 100,
  section: {
    slug: 'foo',
    id: 500,
  }
};

module('Integration | Component | article-recirc', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ArticleRecirc/>`);

    assert.dom('[data-test-recirc-recent]').exists();
    assert.dom('[data-test-recirc-featured]').exists();
  });

  test('it fetches featured and recent stories', async function(assert) {

    const store = this.owner.lookup('service:store');
    const stub = this.stub(store, 'query')
      .onFirstCall().resolves([{
        id: 1,
        title: faker.lorem.words(3),
      }, {
        id: 2,
        title: faker.lorem.words(3),
      }, {
        id: 3,
        title: faker.lorem.words(3),
      }])
      .onSecondCall().resolves([{
        id: 5,
        title: faker.lorem.words(3),
      }]);

    this.setProperties({
      ARTICLE,
      store,
    });

    await render(hbs`<ArticleRecirc @article={{ARTICLE}}/>`);

    assert.dom('[data-test-recirc-recent] .c-block').exists({count: 3});
    assert.dom('[data-test-recirc-featured] .c-block').exists({count: 1});

    assert.ok(stub.firstCall.calledWith('article', {
      descendant_of: ARTICLE.section.id,
      limit: 4,
    }), 'recent query is correct');

    assert.ok(stub.secondCall.calledWith('article', {
      descendant_of: ARTICLE.section.id,
      show_as_feature: true,
      limit: 5,
    }), 'featured query is correct');
  });

  test('it dedupes', async function(assert) {
    const store = this.owner.lookup('service:store');
    this.stub(store, 'query')
      .onFirstCall().resolves([ARTICLE, {
        id: 2,
        title: 'Recent 1',
      }, {
        id: 3,
        title: 'Recent 2',
      }, {
        id: 4,
        title: 'Recent 3',
      }])
      .onSecondCall().resolves([ARTICLE, {
        id: 2,
        title: 'Recent 1',
      }, {
        id: 3,
        title: 'Recent 2',
      }, {
        id: 4,
        title: 'Recent 3',
      }, {
        id: 5,
        title: 'Featured',
      }]);

    this.setProperties({
      ARTICLE,
      store,
    });

    await render(hbs`<ArticleRecirc @article={{ARTICLE}}/>`);

    assert.dom('[data-test-recirc-recent] li:nth-child(1) .c-block__title').hasText('Recent 1');
    assert.dom('[data-test-recirc-recent] li:nth-child(2) .c-block__title').hasText('Recent 2');
    assert.dom('[data-test-recirc-recent] li:nth-child(3) .c-block__title').hasText('Recent 3');
    assert.dom('[data-test-recirc-featured] .c-block__title').hasText('Featured');
  });
});
