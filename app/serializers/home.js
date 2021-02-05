import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'home',

  normalize(HomeModel, payload) {
    // the server defines this as an array
    // but it'll always be a single POJO
    // pull out the first index for easier reference in the app
    payload.page_collection_relationship = payload.page_collection_relationship ? payload.page_collection_relationship[0] : null;

    if (payload.page_collection_relationship) {
      payload.page_collection_relationship.attributes = {
        title: payload.page_collection_relationship.title,
        pages: payload.page_collection_relationship.pages
      }

      delete payload.page_collection_relationship.title
      delete payload.page_collection_relationship.pages

      payload.page_collection_relationship.type = 'content-collection',
      payload.page_collection_relationship.id = 4
    }

    console.log(payload)
    return this._super(HomeModel, payload);
  },
});
