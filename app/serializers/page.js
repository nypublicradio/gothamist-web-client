import ApplicationSerializer from './application';


export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'page',

  normalizeQueryRecordResponse(store, PageModel, payload) {
    payload = {
      page: payload,
    };

    return this._super(store, PageModel, payload);
  },
});
