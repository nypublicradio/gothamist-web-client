import Route from '@ember/routing/route';
import { makeHttps } from '../helpers/make-https';

export default Route.extend({
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
});
