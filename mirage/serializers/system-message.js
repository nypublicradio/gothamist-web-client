import ApplicationSerializer from './application';
import { mirageModelToBlock } from '../../utils/wagtail-api';

export default ApplicationSerializer.extend({
  include() {
    return ['productBanners'];
  },
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);
    let response = {
      id: 1,
      "meta": {
        "type": "utils.SystemMessagesSettings",
        "detail_url": "http://localhost/api/v2/system_messages/1/"
      },
      product_banners: json.productBanners.map(mirageModelToBlock)
    };
    return response;
  }
});
