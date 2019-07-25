import ApplicationSerializer from './application';

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
      product_banners: json.productBanners.map(banner => {
        let bannerResponse = {
          id: banner.id,
          type: 'product_banner',
          value: {}
        }
        delete banner.id;
        Object.keys(banner).forEach(key => {
          bannerResponse.value[key] = banner[key]
        });
        return bannerResponse;
      })
    };
    return response;
  }
});
