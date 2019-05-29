import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import config from '../config/environment';

export default DS.RESTAdapter.extend(AdapterFetch, {
  host: config.apiServer,
  namespace: 'topics/search',
  pathForType: () => '',

  queryRecord(store, type, query) {
    query.count = 1;
    return this._super(...arguments).then(response => {
      if (response.entries.length === 0) {
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

      // construct query params according to topics spec
      // multiple keys are unconventional; added as raw key names instead of with the usual `[]`
      // e.g. term=c|food&term=@main
      var qp = Object.keys(query).map(key => {
        if (Array.isArray(query[key])) {
          let vals = query[key];
          return vals.map(val => `${key}=${encodeURIComponent(val)}`).join('&');
        } else {
          return `${key}=${encodeURIComponent(query[key])}`;
        }
      });
      url += `?${qp.join('&')}`;
    }
    return this._super(url, type, options);
  }
});
