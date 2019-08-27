import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

import config from '../config/environment';

export default DS.RESTAdapter.extend(AdapterFetch, {
  init() {
    this._super(...arguments);
    if (!this.DEFAULT_QUERY_PARAMS) {
      this.set('DEFAULT_QUERY_PARAMS', {});
    }
  },

  DEFAULT_QUERY_PARAMS: null,

  host: config.cmsServer,
  namespace: 'api/v2',
  pathForType: () => 'pages',

  buildURL() {
    return `${this._super(...arguments)}/`;
  },

  ajaxOptions(url, type, options) {
    if (type === 'GET' && Object.keys(options.data).length > 0) {
      // query request
      let query = {...this.DEFAULT_QUERY_PARAMS, ...options.data};
      options.data = {};

      // construct query params according to wagtail spec
      // multiple keys are added without with the usual `[]`
      // e.g. tags: ['food', 'news'] -> tags=food&tags=news
      var qp = Object.keys(query).map(key => {
        if (Array.isArray(query[key])) {
          return query[key].map(val => `${key}=${encodeURIComponent(val)}`).join('&');
        } else {
          return `${key}=${encodeURIComponent(query[key])}`;
        }
      });
      url += `?${qp.join('&')}`;
    }
    return this._super(url, type, options);
  },

});
