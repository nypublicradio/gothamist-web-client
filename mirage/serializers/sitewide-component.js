import ApplicationSerializer from './application';
import { mirageModelToBlock } from '../../utils/wagtail-api';

export default ApplicationSerializer.extend({
  include() {
    return ['breakingNews'];
  },
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);
    let response = {
      id: 1,
      "meta": {
        "type": "sitewide.SiteWideComponents",
        "detail_url": "http://localhost/api/v2/sitewide_components/1/"
      },
      breaking_news: json.breakingNews.map(mirageModelToBlock)
    };
    return response;
  }
});
