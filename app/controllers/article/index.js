import Controller from '@ember/controller';
import config from '../../config/environment';


export default Controller.extend({
  queryParams: ['to'],
  to: null, // for scrolling to comments on internal routing


  commentsAnchor: config.commentsAnchor,

  actions: {
    viewGallery() {
      this.transitionToRoute('article.gallery');
    },
    goToSlide(index) {
      this.transitionToRoute('article.gallery', {queryParams: {image: index}});
    }
  }
});
