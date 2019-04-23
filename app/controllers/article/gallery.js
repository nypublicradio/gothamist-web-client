import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['image'],
  image: null,

  viewedSlide(slide, el, index) {
    this.set('image', index);
  },

  shareMetadata: computed('model', function() {
    return {
      twitter: {
        text: this.model.title,
        via: 'gothamist',
      },
      reddit: {
        title: this.model.title,
      },
      email: {
        subject: `From Gothamist: ${this.model.title}`,
        body: `${this.model.title}
        {{URL}}`,
      }
    }
  }),
});
