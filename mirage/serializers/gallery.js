import ApplicationSerializer, { cleanMirageAttrs } from './application';

export default ApplicationSerializer.extend({
  include: ['relatedArticles'], // eslint-disable-line

  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    return cleanMirageAttrs(json, ['count']);
  }
});
