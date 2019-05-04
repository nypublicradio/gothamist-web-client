import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  headData: inject(),

  model({ any }) {
    return this.store.queryRecord('article', {
      record: any
    }).then(article => article.loadGallery());
  },

  afterModel(model) {

    this.headData.setProperties({
      metaDescription: model.excerptPretty,
      ogType: 'article',
      publishedTime: model.publishedMoment.tz('America/New_York').format(),
      modifiedTime: model.modifiedMoment.tz('America/New_York').format(),
      section: model.section.label,
      tags: model.displayTags,
      authors: model.authors,
      image: {
        full: model.thumbnail640,
        width: 640,
      }
    });
  }
});
