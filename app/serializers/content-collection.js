import ApplicationSerializer from './application';
import DS from 'ember-data';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  modelNameFromPayloadKey: () => 'content-collection',
  attrs: {
    pages: {embedded: 'always'}
  }
});
