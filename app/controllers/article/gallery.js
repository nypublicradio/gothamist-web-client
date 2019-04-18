import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['image'],
  image: null,

  viewedSlide(slide, el, index) {
    this.set('image', index);
  }
});
