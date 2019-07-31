import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { or } from '@ember/object/computed';
import { doTargetingForModels, clearTargetingForModels } from 'nypr-ads';
import { wagtailImageUrl } from 'ember-wagtail-images/helpers/wagtail-image-url';

import { GALLERY_PATH } from '../router';

const { hash } = RSVP;


export default Route.extend({
  queryParams: {
    image: {
      replace: true,
    },
  },

  fastboot: inject(),
  headData: inject(),
  metrics: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),

  image: or('fastboot.request.queryParams.image', 'controller.image'),

  titleToken: model => model.title,

  beforeModel() {
    this.dataLayer.push({template: 'article gallery'});

    this.header.addRule('gallery', {
      resting: {
        nav: true,
        donate: true,
        search: true,
        leaderboard: true,
      },
      floating: {
        close: this.closeGallery.bind(this),
        share: true,
        progressTarget: true,
        logoLinkClass: 'is-hiding-letters',
      }
    })
  },


  model({ section, slug }) {
    return this.store.queryRecord('gallery', {
        html_path: `${section}/${GALLERY_PATH}/${slug}`,
      }).then(gallery => {
        return hash({
          gallery,
          articles: gallery.relatedArticles,
          section,
          slug,
      });
    });
  },

  afterModel(model) {
    this.headData.setProperties({
      metaDescription: model.gallery.description,
      ogType: 'article',
      ogTitle: model.gallery.title,
      gallery: model.gallery.slides,
      publishedTime: model.gallery.publishedMoment.format(),
      section: model.section,
      authors: model.gallery.authors,
    });

    if (this.image) {
      let slide = model.gallery.slides[this.image] || {};
      this.headData.setProperties({
        image: {
          full: wagtailImageUrl([
            slide.image,
            640,
            null,
            'width',
          ], {}),
        }
      });
    }

    if (!this.fastboot.isFastBoot) {
      this.set('metrics.context.pageData', {
        // merge with existing value, which is the previous URL set in the application route
        ...this.metrics.context.pageData,
        sections: model.section,
        authors: model.gallery.authors,
        path: `/${model.section}/${GALLERY_PATH}/${model.slug}`,
      });
    }
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      // don't save gallery position
      controller.set('image', null);
    }
  },

  closeGallery() {
    let { firstObject:article } = this.currentModel.gallery.relatedArticles;
    this.transitionTo('article', article.section.slug, article.path);
  },

  actions: {
    didTransition() {
      if (!this.fastboot.isFastBoot && !this.image) {
        window.scrollTo(0, 0);
      }
      doTargetingForModels(this.currentModel);
      return true;
    },
    willTransition() {
      clearTargetingForModels(this.currentModel);
      return true;
    }
  }
});
