import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  keyForCollection: () => 'items',

  serialize(object, { queryParams }) {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    // strip out the mirage only attrs
    json.items.forEach(item => {
      delete item.indexPage; // mirage only
      delete item.section;
      delete item.html_path;
    });

    if (queryParams.html_path) {
      // client is expecting a single object
      return json.items[0];
    } else {
      return {
        ...json,
        meta: {
          total_count: object.models.length,
        },
      };
    }
  }
});
