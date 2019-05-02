import Component from '@ember/component';
import { inject } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  store: inject(),

  tagName: '',

  init() {
    this._super(...arguments);
    this.set('pages', []);
  },

  /**
    Model name to query for in the store

    @argument model
    @type {String}
  */

  /**
    Query hash to pass to the store's `query` method

    @argument query
    @type {Object}
  */

  /**
    Retreived results are passed to callback for context specific processing

    @argument callback
    @type {Function}
    @return {any} altered results
  */

  /**
    Runs a query on the story using the arguments passed in at run time. returns a two dimensional array of pages.

    @method queryMore
    @return {any} pages
  */
  async queryMore() {
    let results = await this.store.query(this.model, this.query);

    if (this.page) {
      this.incrementProperty('page');
    }

    if (typeof this.callback === 'function') {
      results = this.callback(results);
    }

    this.pages.pushObject(results);
    return this.pages;
  },

  /**
    Alias to a page param passed as part of the query

    @computed page
    @type {Number}
  */
  page: alias('query.page'),
});
