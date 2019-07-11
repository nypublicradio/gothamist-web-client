import * as fetch from 'fetch';

import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
// import test from 'ember-sinon-qunit/test-support/test';

import addCommentCount, {
  QUERY_PARAMS,
  BASE,
} from 'gothamist-web-client/utils/add-comment-count';

module('Unit | Utility | add-comment-count', function(hooks) {
  setupTest(hooks);

  skip('it updates an article model', async function(assert) {
    const EXPECTED = 100;
    let store = this.owner.lookup('service:store');
    const ARTICLE = store.createRecord('article', {id: 'foo'});

    let qp = {...QUERY_PARAMS, ...{'thread:ident': ARTICLE.id}};
    qp = Object.keys(qp).map(k => `${k}=${qp[k]}`);
    this.mock(fetch)
      .expects('default')
      .withArgs(`${BASE}?${qp.join('&')}`)
      .resolves(new Response(JSON.stringify({response: [{posts: EXPECTED}]})));

    await addCommentCount(ARTICLE);

    assert.equal(ARTICLE.commentCount, EXPECTED);
  });

  skip('it updates a record array', async function(assert) {
    const EXPECTED = [100, 200, 300];
    let store = this.owner.lookup('service:store');
    let qp = Object.keys(QUERY_PARAMS).map(k => `${k}=${QUERY_PARAMS[k]}`);

    for (let id = 0; id < 3; id++) {
      store.createRecord('article', {id});
      qp.push(`thread:ident=${id}`);
    }

    this.mock(fetch)
      .expects('default')
      .withArgs(`${BASE}?${qp.join('&')}`)
      .resolves(new Response(JSON.stringify({
        response: EXPECTED.map((posts, id) => ({
          posts,
          identifiers: [String(id)]
        })
      )})));

    await addCommentCount(store.peekAll('article'));

    store.peekAll('article').forEach((article, i) => {
      assert.equal(article.commentCount, EXPECTED[i]);
    });

  });
});
