import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { wagtailImageUrl } from 'ember-wagtail-images';

export default Controller.extend({
  queryParams: ['image'],
  image: null,

  viewedSlide(slide, el, index) {
    this.set('image', index);
  },

  slides: computed('model.gallery', function() {
    // make images for each breakpoint
    return this.model.gallery.slides.map(slide => {
      return {
        width: 1200,
        caption: slide.image.caption,
        thumb: wagtailImageUrl([slide.image], 150),
        srcS: wagtailImageUrl([slide.image, 420]),
        srcM: wagtailImageUrl([slide.image, 800]),
        srcL: wagtailImageUrl([slide.image, 1200]),
      }
    });
  }),

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
