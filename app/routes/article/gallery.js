import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { or } from '@ember/object/computed';

export default Route.extend({
  queryParams: {
    image: {
      replace: true,
    },
  },

  fastboot: inject(),
  headData: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),

  image: or('fastboot.request.queryParams.image', 'queryParams.image'),

  titleToken: model => model.title,

  beforeModel() {
    this.dataLayer.push({template: 'article gallery'});

    this.header.addRule('article.gallery', {
      resting: {
        nav: true,
        donate: true,
        search: true,
        leaderboard: true,
      },
      floating: {
        close: this.closeGallery.bind(this),
        share: true,
        progressTarget: true,
        logoLinkClass: 'is-hiding-letters',
      }
    })
  },

  afterModel(model) {
    this.headData.setProperties({
      gallery: model.gallery.slides,
    });

    if (this.image) {
      let slide = model.gallery.slides[this.image] || {};
      this.headData.setProperties({
        image: slide,
      });
    }
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      // don't save gallery position
      controller.set('image', null);
    }
  },

  closeGallery() {
    this.transitionTo('article.index');
  }
});
