import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['to'],
  to: null, // for scrolling to comments on internal routing

  actions: {
    viewGallery() {
      this.transitionToRoute('article.gallery');
    },
    goToSlide(index) {
      this.transitionToRoute('article.gallery', {queryParams: {image: index}});
    }
  }
});
