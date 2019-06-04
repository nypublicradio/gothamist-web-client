import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const oneHundredWords = new Array(50).fill('dummy text ').join('');

module('Integration | Modifier | insert-target', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.oneHundredWords = oneHundredWords;
  });

  test('it inserts ad after 300 words', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','p3','trgt','p4']);
  });

  test('it accepts wordBoundary parameter', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=200}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','trgt','p3','p4']);
  });

  test('it accepts containerSelector parameter', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' containerSelector='.article-body' wordBoundary=300}}>
      <main class='article-body'>
        <p id="p1">{{this.oneHundredWords}}</p>
        <p id="p2">{{this.oneHundredWords}}</p>
        <p id="p3">{{this.oneHundredWords}}</p>
        <p id="p4">{{this.oneHundredWords}}</p>
      </main>
    </div>`);
    let elementList = [...find('.article-body').children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','p3','trgt','p4']);
  });

  test('it should not display ads between headers and paragraph tags', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <h2 id="h2">{{this.oneHundredWords}}</h2>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','h2','p3','trgt','p4']);
  });

  test('it should not display ads directly between a paragraph followed by an embed', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
      <p id="p4">{{this.oneHundredWords}}</p>
      <p id="p5">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','p3','iframe','trgt','p4','p5']);
  });


  test('it should weight embeds as 50 words', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=150}}>
      <iframe id="iframe1"></iframe>
      <iframe id="iframe2"></iframe>
      <iframe id="iframe3"></iframe>
      <iframe id="iframe4"></iframe>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['iframe1','iframe2','iframe3','trgt','iframe4']);
  });


  test('it should handle bare text nodes part 1', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      {{this.oneHundredWords}}
      <p id="p1">{{this.oneHundredWords}}</p>
      {{this.oneHundredWords}}
      <p id="p2">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.childNodes]
      .filter(node => {
        // ignore whitespace only text nodes.
        return !(node.nodeName === '#text'
        && node.textContent.replace(/\s/g, '').length === 0);
      })
      .map(el => el.id || 'text');

    assert.dom('div#trgt').exists({count: 1});
    // Handlebars makes more text nodes than you would expect
    assert.deepEqual(elementList, ['text','p1','text','trgt','p2']);
  });

  test('it should handle bare text nodes part 2', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      {{this.oneHundredWords}}
      {{this.oneHundredWords}}
      {{this.oneHundredWords}}
      <p id="p1">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.childNodes]
      .filter(node => {
        // ignore whitespace only text nodes.
        return !(node.nodeName === '#text'
        && node.textContent.replace(/\s/g, '').length === 0);
      })
      .map(el => el.id || 'text');

    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, [ 'text','text','text','trgt','p1']);
  });

  test('it should insert at the end if less than 300 words', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','trgt']);
  });

  test('it should insert at the end if all else fails', async function(assert) {
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=100}}>
      <h1 id="h1">{{this.oneHundredWords}}</h1>
      <h2 id="h2">{{this.oneHundredWords}}</h2>
      <h3 id="h3">{{this.oneHundredWords}}</h3>
      <h4 id="h4">{{this.oneHundredWords}}</h4>
      <p id="p1">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['h1','h2','h3','h4','p1','iframe','trgt']);
  });
});
