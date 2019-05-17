import moment from 'moment';

import Controller from '@ember/controller';
import { inject } from '@ember/service';

import config from '../../config/environment';


export default Controller.extend({
  queryParams: ['to'],
  to: null, // for scrolling to comments on internal routing

  cookies: inject(),

  commentsAnchor: config.commentsAnchor,

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
      this.set('footerClosed', true);
    }
  }
});
