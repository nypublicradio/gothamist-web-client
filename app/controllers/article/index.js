import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    viewGallery() {
      this.transitionToRoute('article.gallery');
    }
  }
});
