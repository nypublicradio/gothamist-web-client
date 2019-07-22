import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  query(_store, _type, query = {}) {
    let url = this.buildURL('page');
    url = `${url.replace('pages', 'search')}?q=${query.q}`;

    return this.ajax(url);
  },
  queryRecord(_store, _type, query = {}) {
    let url = this.buildURL('page');
    url = `${url}find/?html_path=${query.html_path}`;

    return this.ajax(url);
  },
});
