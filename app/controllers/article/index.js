import moment from 'moment';

import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

import config from '../../config/environment';


export default Controller.extend({
  queryParams: ['to'],
  to: null, // for scrolling to comments on internal routing

  cookies: inject(),

  commentsAnchor: config.commentsAnchor,

  navigateToComments: computed('to', function() {
    let { to, commentsAnchor } = this;
    let goToComments = to === commentsAnchor;
    if (goToComments && this.model.allowComments) {
      return () => document.querySelector(`#${commentsAnchor}`).scrollIntoView();
    }
  }),

  actions: {
    viewGallery() {
      this.transitionToRoute('article.gallery');
    },
    goToSlide(index) {
      this.transitionToRoute('article.gallery', {queryParams: {image: index}});
    },
    closeDonation() {
      let expires = moment().add(24, 'hours').toDate();
      this.cookies.write(config.donateCookie, 1, {expires, path: '/'});
      this.cookies.write(config.articleViewsCookie, 0, {path: '/'});
      this.set('showTout', false);
    }
  }
});
