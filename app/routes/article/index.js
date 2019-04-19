/* global instgrm */
import fetch from 'fetch';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';

import config from '../../config/environment';

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),

  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken: model => model.title,

  afterModel(model) {
    this.header.addRule('article.index', {
      resting: {
        nav: true,
        donate: true,
        search: true,
      },
      floating: {
        headline: model.title,
        share: true,
        donate: true,
        search: true,
      }
    })
    this.controllerFor('application').setProperties({
      headerLandmark: '.c-article__share',
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
