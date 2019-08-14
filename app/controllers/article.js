import moment from 'moment';

import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { wagtailImageUrl } from 'ember-wagtail-images';

import config from '../config/environment';


export default Controller.extend({
  queryParams: ['to'],
  to: null, // for scrolling to comments on internal routing

  cookies: inject(),

  commentsAnchor: config.commentsAnchor,

  navigateToComments: computed('to', function() {
    let { to, commentsAnchor } = this;
    let goToComments = to === commentsAnchor;
    if (goToComments && !this.model.disableComments) {
      return () => document.querySelector(`#${commentsAnchor}`).scrollIntoView();
    }
  }),

  galleryLeadSlides: computed('model.gallery', function() {
    if (!this.model.gallery) {
      return;
    }

    return this.model.gallery.slides.map(({image, title}) => ({
      srcS: wagtailImageUrl([image, 625, 416]),
      thumb: wagtailImageUrl([image, 106, 106]),
      caption: image.caption,
      title,
    }));
  }),

  actions: {
    viewGallery() {
      let { gallery } = this.model;
      this.transitionToRoute('gallery', gallery.section, gallery.slug);
    },
    goToSlide(index) {
      let { gallery } = this.model;
      this.transitionToRoute('gallery', gallery.section, gallery.slug, {queryParams: {image: index}});
    },
    closeDonation() {
      let expires = moment().add(24, 'hours').toDate();
      this.cookies.write(config.donateCookie, 1, {expires, path: '/'});
      this.cookies.write(config.articleViewsCookie, 0, {path: '/'});
      this.set('showTout', false);
    }
  }
});
