import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from '../models/article';
import RSVP from 'rsvp';
const { hash } = RSVP;

export default Route.extend({
  model({ identifier, token }) {
    return this.store.queryRecord('page', {identifier, token},
      {adapterOptions: {preview: true}}
    );
  },
  renderTemplate(controller, model) {
    switch(get(model, 'meta.type')) {
      case ARTICLE_TYPE:
        hash({
          article: model,
          gallery: model.gallery
        }).then(model => {
          this.render('article', { model })
        })
        break;
      default:
        this._super(...arguments);
    }
  }
});
