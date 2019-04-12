import fetch from 'fetch';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';

import config from '../config/environment';

export default Route.extend({
  fastboot: inject(),
  headData: inject(),

  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken: model => model.title,

  model({ any }) {
    return this.store.queryRecord('story', {
      record: any
    });
  },

  afterModel(model) {
    this.controllerFor('application').setProperties({
      showNav: true,
      showShareTools: true,
      headline: model.title,
      showLeaderboard: false,
      headerLandmark: '.c-article__share',
    });

    this.headData.setProperties({
      metaDescription: model.excerptFull,
    });

    // save the comment API call for the client
    if (this.isFastBoot) {
      return;
    }

    // fetch comments count
    fetch(`${config.disqusAPI}/threads/details.json?thread:ident=${model.id}&api_key=${config.disqusKey}&forum=gothamist`)
      .then(r => {
        if (r.status !== 200) {
          const e = new Error("Disqus API call failed.");
          e.response = r;
          throw e;
        } else {
          return r;
        }
      })
      .then(r => r.json())
      .then(({ response }) => model.set('commentCount', response.posts))
      .catch(e => console.warn(e.message)); // eslint-disable-line

    schedule('afterRender', () => {
      // instagram embeds need a manual push after rehydration
      // ember will re-render a fastboot DOM tree,
      // but the IG embed script will only operate once
      if (typeof instgrm !== 'undefined') {
        instgrm.Embeds.process();
      }
    })
  }
});
