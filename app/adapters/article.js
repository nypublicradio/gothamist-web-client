import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import config from '../config/environment';

export default DS.RESTAdapter.extend(AdapterFetch, {
  host: config.cmsServer,
  namespace: 'api/v2',
  pathForType: () => 'pages',

  buildURL() {
    return `${this._super(...arguments)}/`;
  },

  queryRecord(store, type, query = {}) {
    query.limit = 1;
    query.type = 'news.ArticlePages';
    query.fields = '*';
    return this._super(...arguments).then(response => {
      if (response.items.length === 0) {
        throw new DS.NotFoundError();
      }
      return response;
    });
  },

  ajaxOptions(url, type, options) {
    if (type === 'GET' && options.data) {
      // query request
      let query = options.data;
      options.data = {};

      // construct query params according to wagtail spec
      // multiple keys are unconventional; added as comma-separatec raw key names
      // instead of with the usual `[]`
      // e.g. tags=food,news
      var qp = Object.keys(query).map(key => {
        if (Array.isArray(query[key])) {
          let vals = query[key].map(encodeURIComponent).join(',');
          return `${key}=${vals}`;
        } else {
          return `${key}=${encodeURIComponent(query[key])}`;
        }
      });
      url += `?${qp.join('&')}`;
    }
    return this._super(url, type, options);
  }
});
