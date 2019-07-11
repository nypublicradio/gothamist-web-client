import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { doTargetingForModels, clearTargetingForModels } from 'nypr-ads';

import config from '../config/environment';


export default Route.extend({
  cookies: inject(),
  headData: inject(),
  metrics: inject(),
  fastboot: inject(),

  model({ any }) {
    if (!this.cookies.exists(config.donateCookie)) {
      // donate tout has not been closed within the past 24 hours

      // bump the number of articles this person has seen
      let articlesViewed = this.cookies.read(config.articleViewsCookie);

      if (typeof articlesViewed === 'undefined') {
        articlesViewed = 0;
      } else {
        articlesViewed = Number(articlesViewed);
      }

      this.cookies.write(config.articleViewsCookie, articlesViewed + 1, {path: '/'});
    }

    return this.store.queryRecord('article', {
      record: `http://gothamist.com/${any}`,
    }).then(article => article.loadGallery());
  },

  afterModel(model) {

    this.headData.setProperties({
      metaDescription: model.excerptPretty,
      ogType: 'article',
      ogTitle: model.title, // don't include " - Gothamist" like in <title> tag
      publishedTime: model.publishedMoment.tz('America/New_York').format(),
      modifiedTime: model.modifiedMoment.tz('America/New_York').format(),
      section: model.section.label,
      tags: model.displayTags,
      authors: model.authors,
      image: {
        full: model.thumbnail640,
        width: 640,
      },
      ampId: model.platypusId,
    });

    if (!this.fastboot.isFastBoot) {
      this.set('metrics.context.pageData', {
        sections: model.section.label || model.section.basename,
        authors: model.authors,
        path: `/${model.path}`,
      });
    }

  },

  actions: {
    didTransition() {
      let article = this.currentModel;
      doTargetingForModels(article);
      return true;
    },
    willTransition() {
      let article = this.currentModel;
      clearTargetingForModels(article);
      return true;
    }
  }
});
