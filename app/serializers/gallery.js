import ApplicationSerializer from './application';


export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'gallery',

  normalize(GalleryModel, payload) {
    if (payload.slides) {
      payload.slides = payload.slides.map(({ value }) => ({
        title: value.slide_title,
        caption: value.slide_image.caption,
        image: value.slide_image.image,
      }));
    }

    return this._super(GalleryModel, payload);
  },

  extractRelationships(GalleryModel, hash) {
    if (hash.related_articles) {
      return this._super(GalleryModel, {
        related_articles: hash.related_articles.mapBy('id')
      });
    }
  },
});
