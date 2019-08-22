import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from '../models/article';
import { WAGTAIL_MODEL_TYPE as GALLERY_TYPE } from '../models/gallery';
import RSVP from 'rsvp';
const { hash, resolve } = RSVP;
const { log } = console;

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
          gallery: resolve(model.gallery)
            .catch(() => log('gallery not found')),
        }).then(model => {
          this.render('article', { model })
        });
        break;
      case GALLERY_TYPE:
        hash({
          gallery: model,
          articles: model.relatedArticles,
        }).then(model => {
          this.render('gallery', { model })
        });
        break;
      default:
        this._super(...arguments);
    }
  }
});
