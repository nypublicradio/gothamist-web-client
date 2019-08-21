import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from '../models/article';

export default Route.extend({
  model({ identifier, token }) {
    return this.store.queryRecord('page', {identifier, token},
      {adapterOptions: {preview: true}}
    );
  },
  renderTemplate(controller, model) {
    if (typeof FastBoot === 'undefined') {
      switch(get(model, 'meta.type')) {
      case ARTICLE_TYPE:
        this.render('article', {
          model: {
            article: model,
            gallery: model.gallery
          }
        })
        break;
      default:
        this._super(...arguments);
      }
    }
  }
});
