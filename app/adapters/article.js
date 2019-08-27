import PageAdapter from './page';


export const DEFAULT_QUERY_PARAMS = {
  type: 'news.ArticlePage',
  fields: '*',
  order: '-publication_date',
  show_on_index_listing: true,
}

export default PageAdapter.extend({
  DEFAULT_QUERY_PARAMS,
});
