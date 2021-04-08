import ApplicationSerializer from './application';
import DS from 'ember-data';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    page_collection_relationship: { embedded: 'always' },
  },
  modelNameFromPayloadKey: () => 'homepage',
  normalizeQueryRecordResponse(store, primaryModelClass, payload) {
    payload.page_collection_relationship = payload.page_collection_relationship ? payload.page_collection_relationship[0] : {title: "", id: 0, pages: []};
    return this._super(...arguments)
  }
});
