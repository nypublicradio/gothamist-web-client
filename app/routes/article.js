import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { doTargetingForModels, clearTargetingForModels } from 'nypr-ads';
import { wagtailImageUrl } from 'ember-wagtail-images/helpers/wagtail-image-url';
import { reads } from '@ember/object/computed';

import addCommentCount from '../utils/add-comment-count';
import config from '../config/environment';


const {
  articleViewsCookie,
  donateCookie,
} = config;

export default Route.extend({
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),
  cookies: inject(),
  headData: inject(),
  metrics: inject(),
  fastboot: inject(),

  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken: model => model.title,

  model({ section, path }) {
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
      html_path: `${section}/${path}`,
    });//.then(article => article.loadGallery());
  },

  afterModel(model) {
    this.dataLayer.setForType('article', model);
    this.dataLayer.push({template: 'article'});

    this.headData.setProperties({
      metaDescription: model.description,
      ogType: 'article',
      ogTitle: model.title, // don't include " - Gothamist" like in <title> tag
      publishedTime: model.publishedMoment.format(),
      modifiedTime: model.modifiedMoment.isValid() && model.modifiedMoment.format(),
      section: model.section.title,
      tags: model.displayTags,
      authors: model.authors,
      image: {
        full: wagtailImageUrl([{id: model.leadImage.image}, 640, null, 'width'], {}),
      },
    });

    this.header.addRule('article', {
      all: {
        donate: true,
        search: true,
      },
      resting: {
        leaderboard: true,
        nav: true,
      },
      floating: {
        headline: model.title,
        progressTarget: '.c-article__body',
        logoLinkClass: 'u-hide-until--m',
        share: {
          title: model.title,
          permalink: model.permalink,
        }
      }
    });

    this.controllerFor('application').setProperties({
      headerLandmark: '.c-article__share',
    });

    if (!this.isFastBoot) {
      this.set('metrics.context.pageData', {
        // merge with existing value, which is the previous URL set in the application route
        ...this.metrics.context.pageData,
        sections: model.section.slug,
        authors: model.authors,
        path: `/${model.section.slug}/${model.path}`,
      });
    }

    // save the comment API call for the client
    if (this.isFastBoot || model.disableComments) {
      return;
    }

    addCommentCount(model);

  },

  setupController(controller) {
    this._super(...arguments);

    // have seen at least 3 articles
    // have not closed the donation tout in the past 24 hours
    let showTout = this.cookies.read(articleViewsCookie) >= 3 && !this.cookies.exists(donateCookie);
    controller.set('showTout', showTout);
  },

  resetController(controller) {
    controller.set('to', null);
  },

  actions: {
    didTransition() {
      doTargetingForModels(this.currentModel);
      return true;
    },
    willTransition() {
      clearTargetingForModels(this.currentModel);
      this.dataLayer.clearForType('article');
      return true;
    }
  }
});
