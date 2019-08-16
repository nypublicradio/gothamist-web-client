import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from '../models/article';

export default Route.extend({
  model({ identifier, token }) {
    return this.store.queryRecord('article', {},
      {adapterOptions: {preview: true, identifier, token}}
    );
  },
  afterModel(model) {
    // don't transition in fastboot, we
    // don't want the target route to
    // reload the model once it rehydrates
    if (window.location) {
      if (get(model, 'meta.type') === ARTICLE_TYPE) {
        this.transitionTo('article', {
          article: model,
          gallery: model.gallery
        });
      }
    }
  }
});
