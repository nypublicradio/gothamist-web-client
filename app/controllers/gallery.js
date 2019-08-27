import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { wagtailImageUrl } from 'ember-wagtail-images';

export default Controller.extend({
  queryParams: ['image'],
  image: null,

  viewedSlide(slide, el, index) {
    this.set('image', index);
  },

  parentArticle: reads('model.articles.firstObject'),

  slides: computed('model.gallery', function() {
    // make images for each breakpoint
    return this.model.gallery.slides.map(({image, title, caption}) => ({
      thumb: wagtailImageUrl([image, 150, 150]),
      srcS: wagtailImageUrl([image, 420]),
      srcM: wagtailImageUrl([image, 800]),
      srcL: wagtailImageUrl([image, 1200]),
      height: 733, // slides are specified to 733 max in CSS
      caption: caption || image.caption,
      credit: image.credit,
      creditLink: image.creditLink,
      alt: image.alt,
      title,
    }));
  }),

  shareMetadata: computed('parentArticle', function() {
    let { title } = this.parentArticle || {};
    return {
      facebook: {
        utm: {
          source: 'Facebook',
          medium: 'social',
          campaign: 'Shared_Facebook',
        },
      },
      twitter: {
        text: title,
        via: 'gothamist',
        utm: {
          source: 'twitter',
          medium: 'social',
          campaign: 'shared_twitter',
        },
      },
      reddit: {
        title: title,
        utm: {
          source: 'reddit',
          medium: 'social',
          campaign: 'shared_reddit',
        },
      },
      email: {
        subject: `From Gothamist: ${title}`,
        body: `${title}
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
