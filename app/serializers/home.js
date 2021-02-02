import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'home',

  normalize(HomeModel, payload) {
    // the server defines this as an array
    // but it'll always be a single POJO
    // pull out the first index for easier reference in the app
    payload.page_collection_relationship = payload.page_collection_relationship ? payload.page_collection_relationship[0] : null;

    return this._super(HomeModel, payload);
  },
});
