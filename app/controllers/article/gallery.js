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
      facebook: {
        utm: {
          source: 'Facebook',
          medium: 'social',
          campaign: 'Shared_Facebook',
        },
      },
      twitter: {
        text: this.model.title,
        via: 'gothamist',
        utm: {
          source: 'twitter',
          medium: 'social',
          campaign: 'shared_twitter',
        },
      },
      reddit: {
        title: this.model.title,
        utm: {
          source: 'reddit',
          medium: 'social',
          campaign: 'shared_reddit',
        },
      },
      email: {
        subject: `From Gothamist: ${this.model.title}`,
        body: `${this.model.title}
        {{URL}}`,
        utm: {
          source: 'email',
          medium: 'social',
          campaign: 'shared_email',
        },
      }
    }
  }),
});
