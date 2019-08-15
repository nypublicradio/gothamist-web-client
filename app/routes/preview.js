import Route from '@ember/routing/route';

export default Route.extend({
  templateName: 'article',
  model({ identifier, token }) {
    return this.store.queryRecord('article',
      {html_path: 'preview'},
      {adapterOptions: {preview: true, identifier, token}}
    );
  },
  afterModel(model) {
    this.transitionTo('article', model)
  }
});
