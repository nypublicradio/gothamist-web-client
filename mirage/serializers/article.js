import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  keyForCollection: () => 'items',

  serialize(object/*, request*/) {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    return {
      ...json,
      meta: {
        total_count: object.models.length,
      },
    };
  }
});
