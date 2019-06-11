/* global instgrm, twttr */
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';

import addCommentCount from '../../utils/add-comment-count';
import config from '../../config/environment';

const {
  articleViewsCookie,
  donateCookie,
} = config;

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),
  cookies: inject(),

  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken: model => model.title.replace(/(<([^>]+)>)/ig, ''),

  afterModel(model) {
    this.dataLayer.setForType('article', model);
    this.dataLayer.push({template: 'article'});

    this.header.addRule('article.index', {
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
        progressBar: true,
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

    // save the comment API call for the client
    if (this.isFastBoot) {
      return;
    } else if (model.allowComments){
      addCommentCount(model);
    }
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
    willTransition() {
      this.dataLayer.clearForType('article');
      return true;
    },
    didTransition() {
      schedule('afterRender', () => {
        // instagram embeds need a manual push after rehydration
        // ember will re-render a fastboot DOM tree,
        // but the IG embed script will only operate once
        if (typeof instgrm !== 'undefined') {
          instgrm.Embeds.process();
        }

        // load twitter widgets manually after twitter callback has run
        // twitter scripts are stripped from gothamist payload responses to allow
        // for more reliable rendering
        if (typeof twttr !== 'undefined') {
          twttr.ready(t => t.widgets.load());
        }
      });
      return true;
    }
  }
});
