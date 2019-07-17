import DS from 'ember-data';

// use application adapter b/c page adapter implements a non-standard findRecord
import ApplicationAdapter from './application';


export const DEFAULT_QUERY_PARAMS = {
  type: 'news.ArticlePage',
  fields: '*',
  order: '-publication_date',
}

export default ApplicationAdapter.extend({
  DEFAULT_QUERY_PARAMS,

  queryRecord(_store, _type, query = {}) {
    query.limit = 1;
    return this._super(...arguments).then(response => {
      if (response.items.length === 0) {
        throw new DS.NotFoundError();
      }
      return response;
    });
  },

});
