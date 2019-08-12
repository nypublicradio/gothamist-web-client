import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  // we use the query method to hit the elasticsearch backend
  // searches are run on the `Page` model because elasticsearch returns
  // multiple types in the response, and we can support that
  // using ~ * p o l y m o r p h i s m * ~
  // see the `Page` serializer for more

  // when other types use the query method, we want to defer to the
  // default behavior of the RESTAdapter, which is to use the `pages`
  // path and append all the given query params
  urlForQuery(query, modelName) {
    switch(modelName) {
      case 'page':
        return `${this.host}/${this.namespace}/search`;
      default:
        return this._super(...arguments);
    }
  },

  // when we don't know what we're looking for, we use `queryRecord` on the
  // `Page` adapter to look up a wagtail page by its URL path
  // this will redirect to a deatil view, but since we don't know the ID ahead
  // of time, this needs to be a query.
  queryRecord(_store, _type, query = {}, options = {}) {
    if (!query.html_path) {
      throw new Error('html_path is a required argument');
    }

    let url;
    if (options.adapterOptions && options.adapterOptions.preview) {
      let {identifier, token} = options.adapterOptions;
      url = `${this.buildURL()}page_preview?identifier=${identifier}&token=${token}`;
    } else {
      url = `${this.buildURL('page')}find/?html_path=${query.html_path}`;
    }

    return this.ajax(url);
  },
});
