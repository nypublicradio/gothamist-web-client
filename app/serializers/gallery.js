import ApplicationSerializer from './application';


export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'gallery',

  normalize(GalleryModel, payload) {
    if (payload.slides) {
      payload.slides = payload.slides.map(({ value }) => ({
        title: value.slide_title,
        image: {
          id: value.slide_image.image,
          caption: value.slide_image.caption,
        }
      }));
    }

    return this._super(GalleryModel, payload);
  },

});
