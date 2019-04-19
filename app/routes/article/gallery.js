import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Route.extend({
  queryParams: {
    image: {
      replace: true,
    },
  },

  fastboot: inject(),
  headData: inject(),
  header: inject('nypr-o-header'),

  image: reads('fastboot.request.queryParams.image'),

  titleToken: model => model.title,

  beforeModel() {
    this.header.addRule('article.gallery', {
      resting: {
        nav: true,
        donate: true,
        search: true,
        leaderboard: true,
      },
      floating: {
        close: true,
        share: true,
      }
    })
  },

  afterModel(model) {
    this.controllerFor('application').setProperties({
      headerLandmark: null,
    });

    this.headData.setProperties({
      gallery: model.gallery.slides,
    });

    if (this.image) {
      let slide = model.gallery.slides[this.image] || {};
      this.headData.setProperties({
        image: slide,
      });
    }
  }
});
