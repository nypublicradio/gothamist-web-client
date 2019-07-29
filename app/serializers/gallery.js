import ApplicationSerializer from './application';


export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'gallery',

  normalizeQueryRecordResponse(store, PageModel, payload) {
    payload = {
      [this.modelNameFromPayloadKey()]: payload,
    };

    return this._super(store, PageModel, payload);
  },
});
