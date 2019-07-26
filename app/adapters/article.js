import PageAdapter from './page';


export const DEFAULT_QUERY_PARAMS = {
  type: 'news.ArticlePage',
  fields: '*',
  order: '-publication_date',
}

export default PageAdapter.extend({
  DEFAULT_QUERY_PARAMS,

  queryRecord(_store, _type, query = {}) {
    if (!query.html_path) {
      throw new Error('html_path is a required argument');
    }
    // HACK: articles currently have `articles` in the page path for the moment
    let path = query.html_path.split('/');
    path.splice(1, 0, 'articles');
    query.html_path = path.join('/')
    
    return this._super(...arguments);
  },

});
