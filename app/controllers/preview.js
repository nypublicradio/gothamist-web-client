import ArticleController from './article';

export default ArticleController.extend({
  queryParams: ['to','identifier','token'],
  to: null,
  identifier: null,
  token: null,
});
