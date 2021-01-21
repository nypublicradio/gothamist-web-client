import moment from 'moment';

const NEWSLETTER_ENDPOINT = `${config.apiServer}/opt-in/v1/subscribe/mailchimp`;
const NEWSLETTER_PARAMS = {list: config.dailyNewsletter};

import PageController from './page'
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { wagtailImageUrl } from 'ember-wagtail-images';
import trackEvent from '../utils/track-event';

import config from '../config/environment';


export default PageController.extend({
  NEWSLETTER_ENDPOINT,
  NEWSLETTER_PARAMS,
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

    return this.model.gallery.slides.map(({image, title, caption}) => ({
      srcS: wagtailImageUrl([image, 661, 496]),
      thumb: wagtailImageUrl([image, 106, 106]),
      caption: caption || image.caption,
      alt: image.alt,
      credit: image.credit,
      creditLink: image.creditLink,
      title,
    }));
  }),

  trackEvent,

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
