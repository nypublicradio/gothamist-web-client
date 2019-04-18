import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Route.extend({
  fastboot: inject(),
  headData: inject(),

  // isFastBoot: reads('fastboot.isFastBoot'),
  image: reads('fastboot.request.queryParams.image'),

  titleToken: model => `Photos - ${model.title}`,

  afterModel(model) {
    this.controllerFor('application').setProperties({
      showNav: true,
      showShareTools: true,
      headline: null,
      showLeaderboard: false,
      headerLandmark: null,
    });

    if (this.image) {
      let slide = model.gallery.slides[this.image];
      let src = slide ? slide.full : '';
      this.headData.setProperties({
        metaImage: src
      });
    }
  }
});
