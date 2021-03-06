import RSVP from 'rsvp';

import PageRoute from './page'
import { inject } from '@ember/service';
import { doTargetingForModels, clearTargetingForModels } from 'nypr-ads-htl';
import { reads } from '@ember/object/computed';

import addCommentCount from '../utils/add-comment-count';
import config from '../config/environment';


const {
  articleViewsCookie,
  donateCookie,
} = config;

const { hash } = RSVP;

const { log } = console;

export default PageRoute.extend({
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),
  cookies: inject(),
  headData: inject(),
  metrics: inject(),
  fastboot: inject(),
  sensitive: inject('ad-sensitivity'),

  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken: model => model.article.title,

  model({ section, path }) {
    return this.store.queryRecord('article', {
      html_path: `${section}/${path}`,
    }).then(article => hash({
      article,
       // load gallery in the model hook to prevent async leaks in fastboot
       // but if gallery fails for some reason, don't bork out
      gallery: article.gallery.catch(() => log('gallery not found')),
    }));
  },

  async afterModel({ article }) {
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

    if (article.sensitiveContent) {
      this.sensitive.activate();
    }

    this.dataLayer.setForType('article', article);
    this.dataLayer.push({template: 'article'});

    this.headData.setProperties({
      metaDescription: article.description,
      ogType: 'article',
      ogTitle: article.title, // don't include " - Gothamist" like in <title> tag
      publishedTime: article.publishedMoment.format(),
      modifiedTime: article.modifiedMoment.isValid() && article.modifiedMoment.format(),
      section: article.section.title,
      tags: article.displayTags.mapBy('name'),
      authors: article.authors,
      image: article.ogImage,
      hideFromRobots: !article.showOnIndexListing,
      path: `${article.section.slug}/${article.path}`,
      canonicalUrl: article.canonicalUrl
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
        headline: article.title,
        progressTarget: '.c-article__body',
        logoLinkClass: 'u-hide-until--m',
        share: {
          title: article.title,
          permalink: article.permalink,
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
        sections: article.section.slug,
        authors: article.authors,
        path: `/${article.section.slug}/${article.path}`,
      });
    }

    // save the comment API call for the client
    if (this.isFastBoot || article.disableComments) {
      return;
    }

    addCommentCount(article);

  },

  setupController(controller) {
    this._super(...arguments);

    // have seen at least 3 articles
    // have not closed the donation tout in the past 24 hours
    let showTout = this.cookies.read(articleViewsCookie) >= 3 && !this.cookies.exists(donateCookie);
    controller.set('showTout', showTout);
    controller.set('isPreview', false);
  },

  actions: {
    didTransition() {
      doTargetingForModels(this.currentModel.article);
      return true;
    },
    willTransition() {
      clearTargetingForModels(this.currentModel.article);
      this.dataLayer.clearForType('article');
      return true;
    }
  }
});
