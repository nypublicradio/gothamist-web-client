import DomFixer from 'gothamist-web-client/utils/dom-fixer';
import { module, test } from 'qunit';

module('Unit | Utility | dom-fixer', function() {

  test('it works', function(assert) {
    assert.expect(4);
    try {
      new DomFixer();
    } catch(e) {
      assert.ok('throws if no string is passed in');
    }

    const HTML = '<p>hello <strong>world</strong></p>';
    let domFixer = new DomFixer(HTML);

    assert.ok(domFixer.nodes instanceof DocumentFragment, 'makes a document fragment out of some text');
    assert.equal(domFixer.nodes.firstElementChild.outerHTML, HTML);

    assert.deepEqual(domFixer.querySelector('p'), domFixer.nodes.querySelector('p'), 'calling querySelector on the instance is the same as calling it on the nodes');
  });

  test('removeEmptyNodes deletes empty text nodes', function(assert) {
    const HTML = `
      <p>hello</p>
      <p>world</p>
    `;
    let domFixer = new DomFixer(HTML);

    assert.equal(5, domFixer.nodes.childNodes.length, 'should be 5 nodes in the parsed output');
    assert.deepEqual(['#text', 'P', '#text', 'P', '#text'], [...domFixer.nodes.childNodes].map(n => n.nodeName));
    assert.deepEqual(['', 'hello', '', 'world', ''], [...domFixer.nodes.childNodes].map(n => n.textContent.trim()));

    domFixer.removeEmptyNodes();

    assert.equal(2, domFixer.nodes.childNodes.length, 'should only be 2 nodes after removing empty text nodes');
    assert.deepEqual(['P', 'P'], [...domFixer.nodes.childNodes].map(n => n.nodeName));
    assert.deepEqual(['hello', 'world'], [...domFixer.nodes.childNodes].map(n => n.textContent.trim()));
  });

  test('removeEmptyNodes preserves whitespace between anchor links', function(assert) {
    const HTML = `
      <p>
        Hello <a href>world</a> <a href>foo</a> bar.
      </p>
    `;

    let domFixer = new DomFixer(HTML);
    domFixer.removeEmptyNodes();

    assert.equal(domFixer.nodes.textContent.trim(), "Hello world foo bar.");
  });

  test('rescueOrphans moves text nodes into a <p/>', function(assert) {
    const HTML = `<p>hello</p>
      foo bar baz<br>
      biz baz buz
      <p>world</p>
      <a>click here</a> for more`;
    let domFixer = new DomFixer(HTML);

    assert.equal(8, domFixer.nodes.childNodes.length, 'should be 9 nodes in the parsed output');
    assert.deepEqual([
      'P', '#text', 'BR', '#text', 'P', '#text', 'A', '#text'
    ], [...domFixer.nodes.childNodes].map(n => n.nodeName));

    domFixer.rescueOrphans();

    assert.equal(4, domFixer.nodes.childNodes.length, 'should be 4 nodes after rescuing orphans');
    assert.deepEqual(['P', 'P', 'P', 'P'], [...domFixer.nodes.childNodes].map(n => n.nodeName));
  });

  test('unbreakParagraphs splits a paragraph with double line breaks into multiple paragraphs', function(assert) {
    assert.expect(10);
    const HTML = `<p>
      hello world
      <br>
      <br>
      foo bar baz
      <br>
      <br>
      biz buz fuz
    </p><p>
      fizz
      <br>
      <br>
      foooz
    </p>`;
    let domFixer = new DomFixer(HTML);

    assert.equal(domFixer.nodes.childNodes.length, 2, 'should start with two child nodes');
    assert.equal(domFixer.nodes.firstElementChild.nodeName, 'P');

    try {
      domFixer.unbreakParagraphs();
    } catch(e) {
      assert.equal(e.message, "Empty nodes must be removed before paragraphs can be split.");
    }

    domFixer.removeEmptyNodes();
    domFixer.unbreakParagraphs();

    assert.equal(5, domFixer.nodes.childNodes.length);
    assert.deepEqual(
      [...domFixer.nodes.childNodes].map(n => n.nodeName),
      ['P', 'P', 'P', 'P', 'P']
    );

    assert.equal(domFixer.nodes.children[0].textContent.trim(), 'hello world');
    assert.equal(domFixer.nodes.children[1].textContent.trim(), 'foo bar baz');
    assert.equal(domFixer.nodes.children[2].textContent.trim(), 'biz buz fuz');
    assert.equal(domFixer.nodes.children[3].textContent.trim(), 'fizz');
    assert.equal(domFixer.nodes.children[4].textContent.trim(), 'foooz');
  });

  test('secureSrc secures the src attributes of the passed in selector', function(assert) {
    const HTML = `
      <img src="http://picsum.photos/200/300" />
      <img src="http://picsum.photos/400" />

      <iframe src="http://gothaimst.com" />
      <iframe src="http://google.com" />
      <iframe src="https://google.com" />
    `;
    let domFixer = new DomFixer(HTML);

    assert.ok([...domFixer.querySelectorAll('img, iframe')].every(n => n.src.startsWith('http://')));

    domFixer.secureSrc('img');
    assert.ok([...domFixer.querySelectorAll('img')].every(n => n.src.startsWith('https://')));

    domFixer.secureSrc('iframe');
    assert.ok([...domFixer.querySelectorAll('iframe')].every(n => n.src.startsWith('https://')));
  });

  test('externalizeAnchors makes anchors open in a new window', function(assert) {
    const HTML = `
      <a href="${window.location}/foo" id="internal">click here</a>
      <a href="https://google.com" id="external">click here too</a>
    `;
    let domFixer = new DomFixer(HTML);

    domFixer.externalizeAnchors();

    assert.dom(domFixer.querySelector('#external')).hasAttribute('target', '_blank');
    assert.dom(domFixer.querySelector('#external')).hasAttribute('rel', 'noopener');
  });
});
