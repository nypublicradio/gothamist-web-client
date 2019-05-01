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
        const error = new DS.NotFoundError();
        error.url = query.record;
        throw error;
      }
      return response;
    });
  }
});
