import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

import {
  CAPTION_WITH_CREDIT,
  CREDIT_WITH_LINK,
  CAPTION_WITH_LINK,
  CAPTION_WITH_WHITESPACE,
  // CAPTION_WITH_MULTIPLE_PARENS,
  DOUBLE_BREAKS,
  BAD_ARTICLE,
  BAD_ARTICLE_2,
} from '../fixtures/article-fixtures';


module('Unit | Model | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {});
    assert.ok(model);
  });

  test('images and iframes are secured', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: `
      <img id="img" src="http://picsum.photos/300"/>
      <iframe id="iframe" src="http://google.com"></iframe>
    `});

    assert.ok(model.body.querySelector('#img').src.startsWith('https'));
    assert.ok(model.body.querySelector('#iframe').src.startsWith('https'));
  });

  test('lead images', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: CAPTION_WITH_CREDIT});

    assert.equal(model.leadImageCaption, "Barsik may just be NYC's biggest cat.");
    assert.equal(model.leadImageCredit, "Animal Care Centers of NYC");

    model = store.createRecord('article', {text: CREDIT_WITH_LINK});

    assert.equal(model.leadImageCaption, "Barsik may just be NYC's biggest cat.");
    assert.equal(model.leadImageCredit, `<a href="http://example.com" target="_blank" rel="noopener">Animal Care Centers of NYC</a>`);

    model = store.createRecord('article', {text: CAPTION_WITH_LINK});

    assert.equal(model.leadImageCaption, `A Latch M-series keyless entrance, <a href="https://www.latch.com/m-series" target="_blank" rel="noopener">via Latch's website</a>.`);
    assert.notOk(model.leadImateCredit);

    model = store.createRecord('article', {text: CAPTION_WITH_WHITESPACE});

    assert.equal(model.leadImageCaption, 'Joseph Jordan a.k.a Eric Striker');
    assert.equal(model.leadImageCredit, 'Courtesy of the Southern Poverty Law Center');
  })

  test('external links', function(assert) {
    const URL = window.location.toString();
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: `
      <p>
        <a href="http://google.com" id="external">external link</a>
      </p>
      <p>
        <a href="${URL}">internal link</a>
      </p>
    `});

    let external = model.body.querySelector('#external');
    let internal = model.body.querySelector('#internal');

    assert.dom(external).hasAttribute('target', '_blank', 'external link gets target blank');
    assert.dom(external).hasAttribute('rel', 'noopener', 'target blank gets no opener');

    assert.dom(internal).doesNotHaveAttribute('target');
  });

  test('blockquotes are repaired', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: `
      <blockquote>
        raw text here, followed by <a href="http://google.com">a link</a>

        <p>
          nested text here
        </p>
      </blockquote>
    `});

    let paragraphs = model.body.querySelectorAll('blockquote p');
    assert.equal(paragraphs.length, 2, 'raw text wrapped in a <p/>');

    assert.dom(paragraphs[0]).hasText('raw text here, followed by a link');
    assert.equal(paragraphs[0].firstElementChild.nodeName, 'A', 'anchor tag is wrapped into paragraph');
  });

  test('directly nested raw text is also fixed', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: BAD_ARTICLE});

    let noTextNodes = [...model.body.childNodes].every(node => {
      if (node.nodeType !== node.TEXT_NODE) {
        return true;
      } else if (!node.textContent.trim()) {
        // empty text nodes are ok
        return true;
      } else {
        return false;
      }
    });

    assert.ok(noTextNodes, 'all text nodes should be wrapped');
    assert.ok(model.body.childNodes.length, 'make sure nodes are returned');

  });

  skip('two adjacent line breaks creates two paragraphs', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: DOUBLE_BREAKS});

    let childNodes = [...model.body.childNodes].map(node => node.nodeName);

    assert.deepEqual(childNodes, ['P', 'P', 'P'], 'should have 3 paragraphs');
  });

  test('this bad article', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: BAD_ARTICLE_2});

    assert.ok(model.body);
  });
});
