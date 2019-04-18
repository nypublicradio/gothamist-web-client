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

  // isFastBoot: reads('fastboot.isFastBoot'),
  image: reads('fastboot.request.queryParams.image'),

  titleToken: model => model.title,

  afterModel(model) {
    this.controllerFor('application').setProperties({
      showNav: true,
      showShareTools: true,
      headline: null,
      showLeaderboard: false,
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
