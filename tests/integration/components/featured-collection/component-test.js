import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | featured-collection', function(hooks) {
  setupRenderingTest(hooks);

  test('displays a colleciton with one article', async function(assert) {
    const collection = {
      pages: [
        {title: "Title 1", description: "Description 1"}
      ]
    }
    this.set('collection', collection)

    await render(hbs`<FeaturedCollection @collection={{collection}} />`);

    let articles = this.element.querySelectorAll('.c-block')
    assert.equal(this.element.querySelectorAll('.featured-list-one-up').length, 1)
    assert.equal(articles.length, 1)

    assert.dom('[data-test-block-title]', articles[0]).containsText('Title 1')
    assert.dom('.c-block__dek', articles[0]).containsText('Description 1')
  });

  test('displays a colleciton with two articles', async function(assert) {
    const collection = {
      pages: [
        {title: "Title 1", description: "Description 1"},
        {title: "Title 2", description: "Description 2"}
      ]
    }
    this.set('collection', collection)

    await render(hbs`<FeaturedCollection @collection={{collection}} />`);

    let articles = this.element.querySelectorAll('.c-block')
    assert.equal(this.element.querySelectorAll('.featured-list-two-up').length, 1)
    assert.equal(articles.length, 2)

    assert.dom('[data-test-block-title]', articles[0]).containsText('Title 1')
    assert.dom('.c-block__dek', articles[0]).containsText('Description 1')
    assert.dom('[data-test-block-title]', articles[1]).containsText('Title 2')
    assert.dom('.c-block__dek', articles[1]).containsText('Description 2')
  });

  test('displays a colleciton with three articles', async function(assert) {
    const collection = {
      pages: [
        {title: "Title 1", description: "Description 1"},
        {title: "Title 2", description: "Description 2"},
        {title: "Title 3", description: "Description 3"}
      ]
    }
    this.set('collection', collection)

    await render(hbs`<FeaturedCollection @collection={{collection}} />`);

    let articles = this.element.querySelectorAll('.c-block')
    assert.equal(this.element.querySelectorAll('.featured-list-one-up').length, 1)
    assert.equal(this.element.querySelectorAll('.featured-list-two-up').length, 1)
    assert.equal(articles.length, 3)

    assert.dom('[data-test-block-title]', articles[0]).containsText('Title 1')
    assert.dom('.c-block__dek', articles[0]).containsText('Description 1')
    assert.dom('[data-test-block-title]', articles[1]).containsText('Title 2')
    assert.dom('.c-block__dek', articles[1]).containsText('Description 2')
    assert.dom('[data-test-block-title]', articles[2]).containsText('Title 3')
    assert.dom('.c-block__dek', articles[2]).containsText('Description 3')
  });

  test('displays a colleciton with four articles', async function(assert) {
    const collection = {
      pages: [
        {title: "Title 1", description: "Description 1"},
        {title: "Title 2", description: "Description 2"},
        {title: "Title 3", description: "Description 3"},
        {title: "Title 4", description: "Description 4"}
      ]
    }
    this.set('collection', collection)

    await render(hbs`<FeaturedCollection @collection={{collection}} />`);

    let articles = this.element.querySelectorAll('.c-block')
    assert.equal(this.element.querySelectorAll('.featured-list-two-up').length, 2)
    assert.equal(articles.length, 4)

    assert.dom('[data-test-block-title]', articles[0]).containsText('Title 1')
    assert.dom('.c-block__dek', articles[0]).containsText('Description 1')
    assert.dom('[data-test-block-title]', articles[1]).containsText('Title 2')
    assert.dom('.c-block__dek', articles[1]).containsText('Description 2')
    assert.dom('[data-test-block-title]', articles[2]).containsText('Title 3')
    assert.dom('.c-block__dek', articles[2]).containsText('Description 3')
    assert.dom('[data-test-block-title]', articles[3]).containsText('Title 4')
    assert.dom('.c-block__dek', articles[3]).containsText('Description 4')
  });

  test('displays a colleciton with five articles', async function(assert) {
    const collection = {
      pages: [
        {title: "Title 1", description: "Description 1"},
        {title: "Title 2", description: "Description 2"},
        {title: "Title 3", description: "Description 3"},
        {title: "Title 4", description: "Description 4"},
        {title: "Title 5", description: "Description 5"}
      ]
    }
    this.set('collection', collection)

    await render(hbs`<FeaturedCollection @collection={{collection}} />`);

    let articles = this.element.querySelectorAll('.c-block')
    assert.equal(this.element.querySelectorAll('.featured-list-one-up').length, 1)
    assert.equal(this.element.querySelectorAll('.featured-list-two-up').length, 2)
    assert.equal(articles.length, 5)

    assert.dom('[data-test-block-title]', articles[0]).containsText('Title 1')
    assert.dom('.c-block__dek', articles[0]).containsText('Description 1')
    assert.dom('[data-test-block-title]', articles[1]).containsText('Title 2')
    assert.dom('.c-block__dek', articles[1]).containsText('Description 2')
    assert.dom('[data-test-block-title]', articles[2]).containsText('Title 3')
    assert.dom('.c-block__dek', articles[2]).containsText('Description 3')
    assert.dom('[data-test-block-title]', articles[3]).containsText('Title 4')
    assert.dom('.c-block__dek', articles[3]).containsText('Description 4')
    assert.dom('[data-test-block-title]', articles[4]).containsText('Title 5')
    assert.dom('.c-block__dek', articles[4]).containsText('Description 5')
  });

});
