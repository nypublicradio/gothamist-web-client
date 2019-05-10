/* global instgrm */
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';

import addCommentCount from '../../utils/add-comment-count';

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),

  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken: model => model.title,

  afterModel(model) {
    this.dataLayer.setForType('article', model);
    this.dataLayer.push({template: 'article'});

    this.header.addRule('article.index', {
      all: {
        donate: true,
        search: true,
      },
      resting: {
        nav: true,
      },
      floating: {
        headline: model.title,
        share: true,
        progressBar: true,
      }
    })
    this.controllerFor('application').setProperties({
      headerLandmark: '.c-article__share',
    });

    // save the comment API call for the client
    if (this.isFastBoot) {
      return;
    } else if (model.allowComments){
      addCommentCount(model);
    }

    schedule('afterRender', () => {
      // instagram embeds need a manual push after rehydration
      // ember will re-render a fastboot DOM tree,
      // but the IG embed script will only operate once
      if (typeof instgrm !== 'undefined') {
        instgrm.Embeds.process();
      }
    })
  },

  actions: {
    willTransition() {
      this.dataLayer.clearForType('article');
    }
  }
});
