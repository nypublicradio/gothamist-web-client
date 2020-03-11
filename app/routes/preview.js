import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject } from '@ember/service';
import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from '../models/article';
import { WAGTAIL_MODEL_TYPE as GALLERY_TYPE } from '../models/gallery';
import RSVP from 'rsvp';
const { hash, resolve } = RSVP;
const { log } = console;


export default Route.extend({
  fastboot: inject(),
  model({ identifier, token }) {
    let isFastBoot = this.fastboot.isFastBoot;
    if (isFastBoot) {
      this.fastboot.response.headers.set('Cache-Control', 'no-cache');
    }
    return this.store.queryRecord('page', {identifier, token},
      {adapterOptions: {preview: true}}
    );
  },
  renderTemplate(controller, model) {
    let previewedController;
    switch(get(model, 'meta.type')) {
      case ARTICLE_TYPE:
        previewedController = this.controllerFor('article');
        previewedController.set('isPreview', true);
        hash({
          article: model,
          gallery: resolve(model.gallery)
            .catch(() => log('gallery not found')),
        }).then(model => {
          this.render('article', { model })
        });
        break;
      case GALLERY_TYPE:
        previewedController = this.controllerFor('gallery');
        previewedController.set('isPreview', true);
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
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('isPreview', true);
  },
});
