import ArticleRoute from './article';

export default ArticleRoute.extend({
  templateName: 'article',
  model({ identifier, token }) {
    return this.store.queryRecord('article',
      {html_path: 'preview'},
      {adapterOptions: {preview: true, identifier, token}}
    );
  },
});
