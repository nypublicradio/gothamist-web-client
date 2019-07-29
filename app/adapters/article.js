import PageAdapter from './page';


export const DEFAULT_QUERY_PARAMS = {
  type: 'news.ArticlePage',
  fields: '*',
  order: '-publication_date',
}

export default PageAdapter.extend({
  DEFAULT_QUERY_PARAMS,
});
