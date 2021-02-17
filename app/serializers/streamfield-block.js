import ApplicationSerializer from './application';
import DS from 'ember-data';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    relatedCollection: {embedded: 'always'}
  },
  modelNameFromPayloadKey: () => 'streamfieldBlock',
  normalize(blockModel, hash) {
    debugger;
    if (hash.type === 'content-collection') {
      hash.relatedCollection = hash.value
    }
    return this._super(blockModel, hash)
  }
});
