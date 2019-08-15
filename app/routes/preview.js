import Route from '@ember/routing/route';

export default Route.extend({
  model({ identifier, token }) {
    return this.store.queryRecord('article', {},
      {adapterOptions: {preview: true, identifier, token}}
    );
  },
  afterModel(model) {
    this.transitionTo('article', {
      article: model,
      gallery: model.gallery
    })
  }
});
