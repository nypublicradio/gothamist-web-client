import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import insertAdDiv from 'gothamist-web-client/utils/insert-ad-div';

import hbs from 'htmlbars-inline-precompile';

const oneHundredWords = new Array(50).fill('dummy text ').join('');

module('Unit | Utility | insert-ad-div', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.oneHundredWords = oneHundredWords;
  });

  test('it inserts ad after 300 words', async function(assert) {
    await render(hbs`<div id="container">
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let container = document.querySelector('#container');

    insertAdDiv('trgt', container, {wordsBeforeAd: 300})
 
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','p3','trgt','p4']);
  });

  test('it accepts wordsBeforeAd parameter', async function(assert) {
    await render(hbs`<div id="container">
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let container = document.querySelector('#container');
 
    insertAdDiv('trgt', container, {wordsBeforeAd: 200})

    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','trgt','p3','p4']);
  });

  test('it should not display ads between headers and paragraph tags', async function(assert) {
    await render(hbs`<div id="container">
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <h2 id="h2">{{this.oneHundredWords}}</h2>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let container = document.querySelector('#container');
    
    insertAdDiv('trgt', container, {wordsBeforeAd: 300});

    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','h2','p3','trgt','p4']);
  });

  test('it should not display ads directly between a paragraph followed by an embed', async function(assert) {
    await render(hbs`<div id="container">
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
      <p id="p4">{{this.oneHundredWords}}</p>
      <p id="p5">{{this.oneHundredWords}}</p>
    </div>`);
    let container = document.querySelector('#container');
    
    insertAdDiv('trgt', container, {wordsBeforeAd: 300});

    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','p3','iframe','trgt','p4','p5']);
  });

  test('it should weight embeds as 50 words', async function(assert) {
    await render(hbs`<div id="container">
      <iframe id="iframe1"></iframe>
      <iframe id="iframe2"></iframe>
      <iframe id="iframe3"></iframe>
      <iframe id="iframe4"></iframe>
    </div>`);
    let container = document.querySelector('#container');
    
    insertAdDiv('trgt', container, {wordsBeforeAd: 150});

    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['iframe1','iframe2','iframe3','trgt','iframe4']);
  });

  test('it should handle bare text nodes part 1', async function(assert) {
    await render(hbs`<div id="container">
      {{this.oneHundredWords}}
      <p id="p1">{{this.oneHundredWords}}</p>
      {{this.oneHundredWords}}
      <p id="p2">{{this.oneHundredWords}}</p>
    </div>`);
    let container = document.querySelector('#container');
    
    insertAdDiv('trgt', container, {wordsBeforeAd: 300});

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
    await render(hbs`<div id="container">
      {{this.oneHundredWords}}
      {{this.oneHundredWords}}
      {{this.oneHundredWords}}
      <p id="p1">{{this.oneHundredWords}}</p>
    </div>`);
    let container = document.querySelector('#container');
    
    insertAdDiv('trgt', container, {wordsBeforeAd: 300});

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
    await render(hbs`<div id="container">
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
    </div>`);
    let container = document.querySelector('#container');
    
    insertAdDiv('trgt', container, {wordsBeforeAd: 300});

    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.dom('div#trgt').exists({count: 1});
    assert.deepEqual(elementList, ['p1','p2','trgt']);
  });

  // test('it should reinsert when the contentsId changes', async function(assert) {
  //   this.set('id','foo');
  //   await render(hbs`<div id="container" {{insert-target 'trgt' wordsBeforeAd=300 contentsId=id}}>
  //     <p id="p1">{{this.oneHundredWords}}</p>
  //     <p id="p2">{{this.oneHundredWords}}</p>
  //     <p id="p3">{{this.oneHundredWords}}</p>
  //     <p id="p4">{{this.oneHundredWords}}</p>
  //   </div>`);
  //   let container = document.querySelector('#container');
    
  //   insertAdDiv('trgt', container, {wordsBeforeAd: 300});

  //   let elementList = [...this.element.firstChild.children].map(el => el.id);
  //   assert.dom('div#trgt').exists({count: 1});
  //   assert.deepEqual(elementList, ['p1','p2','p3','trgt','p4']);

  //   this.element.querySelector('#container').innerHTML =
  //     `<p id="p5">${this.oneHundredWords}</p>` +
  //     `<p id="p6">${this.oneHundredWords}</p>` +
  //     `<p id="p7">${this.oneHundredWords}</p>` +
  //     `<p id="p8">${this.oneHundredWords}</p>`;
  //   this.set('id','bar');
  //   elementList = [...this.element.firstChild.children].map(el => el.id);
  //   assert.dom('div#trgt').exists({count: 1});
  //   assert.deepEqual(elementList, ['p5','p6','p7','trgt','p8']);
  // });
});
