import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  // we use the query method to hit the elasticsearch backend
  // searches are run on the `Page` model because elasticsearch returns
  // multiple types in the response, and we can support that
  // using ~ * p o l y m o r p h i s m * ~
  // see the `Page` serializer for more
  query(_store, _type, query = {}) {
    let url = this.buildURL('page');
    url = `${url.replace('pages', 'search')}?q=${query.q}`;

    return this.ajax(url);
  },

  // when we don't know what we're looking for, we use `queryRecord` on the
  // `Page` adapter to look up a wagtail page by its URL path
  // this will redirect to a deatil view, but since we don't know the ID ahead
  // of time, this needs to be a query.
  queryRecord(_store, _type, query = {}) {
    let url = this.buildURL('page');
    url = `${url}find/?html_path=${query.html_path}`;

    return this.ajax(url);
  },
});
