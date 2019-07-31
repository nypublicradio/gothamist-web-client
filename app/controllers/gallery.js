import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  queryParams: ['image'],
  image: null,

  viewedSlide(slide, el, index) {
    this.set('image', index);
  },

  parentArticle: reads('model.gallery.relatedArticles.firstObject'),

  slides: computed('model.gallery', function() {
    // make images for each breakpoint
    return this.model.gallery.makeSizes({
      thumb: [150, 150],
      srcS: 420,
      srcM: 800,
      srcL: 1200,
    }, {
      width: 1200,
    });
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
