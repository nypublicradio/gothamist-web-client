import { faker } from 'ember-cli-mirage';
import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// import test from 'ember-sinon-qunit/test-support/test';


const ARTICLE = {
  id: 100,
  section: {
    slug: 'foo',
  }
};

module('Integration | Component | article-recirc', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    await render(hbs`<ArticleRecirc/>`);

    assert.dom('[data-test-recirc-popular]').exists();
    assert.dom('[data-test-recirc-featured]').exists();
  });

  skip('it fetches featured and popular stories', async function(assert) {

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

    assert.dom('[data-test-recirc-popular] .c-block').exists({count: 3});
    assert.dom('[data-test-recirc-featured] .c-block').exists({count: 1});

    assert.ok(stub.firstCall.calledWith('article', {
      index: 'gothamist',
      sort: 'socialtopics_score_1d',
      count: 4,
      term: `c|${ARTICLE.section.basename}`,
    }));

    assert.ok(stub.secondCall.calledWith('article', {
      index: 'gothamist',
      term: ['@main', `c|${ARTICLE.section.basename}`],
      count: 5,
    }));
  });

  skip('it dedupes', async function(assert) {
    const store = this.owner.lookup('service:store');
    this.stub(store, 'query')
      .onFirstCall().resolves([ARTICLE, {
        id: 2,
        title: 'Popular 1',
      }, {
        id: 3,
        title: 'Popular 2',
      }, {
        id: 4,
        title: 'Popular 3',
      }])
      .onSecondCall().resolves([ARTICLE, {
        id: 2,
        title: 'Popular 1',
      }, {
        id: 3,
        title: 'Popular 2',
      }, {
        id: 4,
        title: 'Popular 3',
      }, {
        id: 5,
        title: 'Featured',
      }]);

    this.setProperties({
      ARTICLE,
      store,
    });

    await render(hbs`<ArticleRecirc @article={{ARTICLE}}/>`);

    assert.dom('[data-test-recirc-popular] li:nth-child(1) .c-block__title').hasText('Popular 1');
    assert.dom('[data-test-recirc-popular] li:nth-child(2) .c-block__title').hasText('Popular 2');
    assert.dom('[data-test-recirc-popular] li:nth-child(3) .c-block__title').hasText('Popular 3');
    assert.dom('[data-test-recirc-featured] .c-block__title').hasText('Featured');
  });
});
