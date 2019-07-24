import { Factory, faker } from 'ember-cli-mirage';
import { capitalize } from '@ember/string'

const createProductBanner = function() {
  return {
    "id": faker.random.uuid(),
    "type": "product_banner",
    "value": {
      "title": capitalize(faker.lorem.words()),
      "description": `<p>${faker.lorem.sentence(5)}</p>`,
      "button_text": capitalize(faker.lorem.words()),
      "button_link": faker.internet.url(),
      "frequency": 8,
      "location": "TOP"
    }
  }
}

export default Factory.extend({
  id(i) {
    return i + 1;
  },
  meta(i) {
    return {
      type : "utils.SystemMessagesSettings",
      'detail_url': `http://localhost/api/v2/system_messages/${i + 1}/`
    };
  },
  productBanners() {
    return [createProductBanner()];
  }
});
