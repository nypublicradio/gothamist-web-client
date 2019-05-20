import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const oneHundredWords = new Array(50).fill('dummy text ').join('');

module('Integration | Modifier | insert-target', function(hooks) {
  setupRenderingTest(hooks);

  test('it inserts ad after 300 words', async function(assert) {
    this.oneHundredWords = oneHundredWords;
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, ['p1','p2','p3','trgt','p4']);
  });

  test('it accepts wordBoundary parameter', async function(assert) {
    this.oneHundredWords = oneHundredWords;
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=200}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, ['p1','p2','trgt','p3','p4']);
  });

  test('it accepts containerSelector parameter', async function(assert) {
    this.oneHundredWords = oneHundredWords;
    await render(hbs`<div {{insert-target 'trgt' containerSelector='.article-body' wordBoundary=300}}>
      <main class='article-body'>
        <p id="p1">{{this.oneHundredWords}}</p>
        <p id="p2">{{this.oneHundredWords}}</p>
        <p id="p3">{{this.oneHundredWords}}</p>
        <p id="p4">{{this.oneHundredWords}}</p>
      </main>
    </div>`);
    let elementList = [...find('.article-body').children].map(el => el.id);
    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, ['p1','p2','p3','trgt','p4']);
  });

  test('it should not display ads between headers and paragraph tags', async function(assert) {
    this.oneHundredWords = oneHundredWords;
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <h2 id="h2">{{this.oneHundredWords}}</h2>
      <p id="p3">{{this.oneHundredWords}}</p>
      <p id="p4">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, ['p1','p2','h2','p3','trgt','p4']);
  });

  test('it should not display ads directly above or below social embed or video', async function(assert) {
    this.oneHundredWords = oneHundredWords;
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
      <p id="p3">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
      <p id="p4">{{this.oneHundredWords}}</p>
      <p id="p5">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, ['p1','p2','p3','iframe','p4','trgt','p5']);
  });

  test('it should handle bare text nodes part 1', async function(assert) {
    this.oneHundredWords = oneHundredWords;
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

    assert.ok(find('div#trgt'));
    // Handlebars makes more text nodes than you would expect
    assert.deepEqual(elementList, ['text','p1','text','trgt','p2']);
  });

  test('it should handle bare text nodes part 2', async function(assert) {
    this.oneHundredWords = oneHundredWords;
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

    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, [ 'text','text','text','trgt','p1']);
  });

  test('it should insert at the end if less than 300 words', async function(assert) {
    this.oneHundredWords = oneHundredWords;
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <p id="p2">{{this.oneHundredWords}}</p>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, ['p1','p2','trgt']);
  });

  test('it should insert at the end if all else fails', async function(assert) {
    this.oneHundredWords = oneHundredWords;
    await render(hbs`<div {{insert-target 'trgt' wordBoundary=300}}>
      <p id="p1">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
      <p id="p2">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
      <p id="p3">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
      <p id="p4">{{this.oneHundredWords}}</p>
      <iframe id="iframe"></iframe>
    </div>`);
    let elementList = [...this.element.firstChild.children].map(el => el.id);
    assert.ok(find('div#trgt'));
    assert.deepEqual(elementList, ['p1','iframe','p2','iframe','p3','iframe','p4','iframe','trgt']);
  });
});
