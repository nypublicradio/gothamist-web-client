import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { doTargetingForModels, clearTargetingForModels } from 'nypr-ads';
import { wagtailImageUrl } from 'ember-wagtail-images/helpers/wagtail-image-url';

import config from '../config/environment';


export default Route.extend({
  cookies: inject(),
  headData: inject(),
  metrics: inject(),
  fastboot: inject(),

  model({ section, slug }) {
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
      html_path: `${section}/${slug}`,
    });//.then(article => article.loadGallery());
  },

  afterModel(model) {

    this.headData.setProperties({
      metaDescription: model.description,
      ogType: 'article',
      ogTitle: model.title, // don't include " - Gothamist" like in <title> tag
      publishedTime: model.publishedMoment.format(),
      modifiedTime: model.modifiedMoment.format(),
      section: model.section.title,
      tags: model.displayTags,
      authors: model.authors,
      image: {
        full: wagtailImageUrl([model.leadImage, 640, null, 'width'], {}),
      },
    });

    if (!this.fastboot.isFastBoot) {
      this.set('metrics.context.pageData', {
        // merge with existing value, which is the previous URL set in the application route
        ...this.metrics.context.pageData,
        sections: model.section.title || model.section.slug,
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
