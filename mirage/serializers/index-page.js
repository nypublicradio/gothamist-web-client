import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(_object, request) {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    if (request.queryParams.html_path) {
      let [ page ] = json.indexPages;

      delete page.descendants; // only for mirage
      // find request
      return json.indexPages[0];
    } else {
      return json;
    }
  }
});
