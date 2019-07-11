import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';


const DEFAULT_TOTAL_KEY = 'total';

export default Component.extend({
  store: inject(),

  tagName: '',

  init() {
    this._super(...arguments);
    this.set('pages', []);

    if (!this.totalKey) {
      this.set('totalKey', DEFAULT_TOTAL_KEY);
    }

    this._specifyOffset();
  },

  didUpdateAttrs() {
    this._specifyOffset();
  },

  /**
    Key to use to look up total result size on the store response's `meta` object.

    @argument totalKey
    @type {String}
    @defult 'count'
  */

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
    Stored total count from server query. Used to calculate `isFinished`

    @field total
    @type {Number}
  */

  /**
    Runs a query on the store using the arguments passed in at run time. returns a two dimensional array of pages.

    **NOTE** This is an ember concurrency task, so you need to use the `perform` helper instad of
    the `action` helper when attaching it as a click handler.
    @method queryMore
    @return {Array[Model]} pages
  */
  queryMore: task(function *() {
    let results = yield this.store.query(this.model, this.query);

    this.set('total', get(results, `meta.${this.totalKey}`));

    if (this.page) {
      // if using pages, increment page counter
      this.incrementProperty('page');
    } else if (this.limit) {
      // if using limit/offset, increment offset counter
      this.incrementProperty('offset', this.limit);
    }

    if (typeof this.callback === 'function') {
      results = this.callback(results);
    }

    this.pages.pushObject(results);
    return this.pages;
  }),

  /**
    Alias to a page param passed as part of the query

    @computed page
    @type {Number}
  */
  page: alias('query.page'),

  /**
    Alias to a limit param passed as part of the query

    @computed limit
    @type {Number}
  */
  limit: alias('query.limit'),

  /**
    Alias to offset param to get set on the passed in query.
    Used to track page position in limit/offset scenarios

    @computed offset
    @type {Number}
  */
  offset: alias('query.offset'),

  /**
    Reflects if there are more results on the server.

    @accessor isFinished
    @type {Boolean}
  */
  isFinished: computed('pages.[]', 'total', 'query.{count,limit}', function() {
    let pageSize = this.query && (this.query.count || this.query.limit);
    if (!pageSize) {
      console.warn('`count` or `limit` must be provided to the query in order to calculate `hasMore`'); // eslint-disable-line
      return;
    }

    let retrievedResults = this.pages.length * pageSize;
    // is there at least one more page remaining on the server?
    return retrievedResults + pageSize > this.total;
  }),

  /**
    Prep offset param to track page position
    First request should be offset by passed in limit

    @method _specifyOffset
    @private
  */
  _specifyOffset() {
    if (this.limit) {
      this.set('offset', this.limit);
    }
  },
});
