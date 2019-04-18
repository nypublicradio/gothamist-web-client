import moment from 'moment';

import Route from '@ember/routing/route';
import { makeHttps } from '../helpers/make-https';
import { inject } from '@ember/service';

export default Route.extend({
  headData: inject(),

  model({ any }) {
    return this.store.queryRecord('article', {
      record: any
    }).then(article => {
      if (!article.hasGallery) {
        return article;
      }

      if (article.galleryDropbox) {
        return this.store.findRecord('gallery', article.entrytopics[0])
          .then(gallery => {
            article.set('gallery', gallery);
            return article;
          });
      } else {
        let slides = [];
        for (let i = 0; i < article.galleryFull.length; i++) {
          slides.push({
            full: makeHttps([article.galleryFull[i]]),
            src: makeHttps([article.galleryArray[i]]),
            caption: article.galleryCaptions[i],
            credit: article.galleryCredit[i],
          });
        }
        article.set('gallery', {slides});
        return article;
      }
    })
  },

  afterModel(model) {

    this.headData.setProperties({
      metaDescription: model.excerptPretty,
      ogType: 'article',
      publishedTime: moment.utc(model.authoredOnUtc, 'YYYYMMDDHHmmss').tz('America/New_York').format(),
      modifiedTime: moment.utc(model.modifiedOnUtc, 'YYYYMMDDHHmmss').tz('America/New_York').format(),
      section: model.section,
      tags: model.displayTags,
      authors: model.authors,
      image: model.thumbnail640,
      imageWidth: 640,
    });
  }
});
