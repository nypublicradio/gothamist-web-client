import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import config from '../config/environment';

export default DS.RESTAdapter.extend(AdapterFetch, {
  host: config.apiServer,
  namespace: 'topics/search',
  pathForType: () => '',
});
