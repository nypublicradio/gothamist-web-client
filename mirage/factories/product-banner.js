import { Factory, faker } from 'ember-cli-mirage';
import { capitalize } from '@ember/string'

export default Factory.extend({
  id() {
    return faker.random.uuid();
  },
  "type": "product-banner",
  title() {
    return capitalize(faker.lorem.words());
  },
  description() {
    return `<p>${faker.lorem.sentence(5)}</p>`;
  },
  button_text() {
    return capitalize(faker.lorem.words());
  },
  button_link() {
    return faker.internet.url();
  },
  "frequency": 8,
  "location": "TOP",
  afterCreate(productBanner, server) {
    // all product banners get added the the first system message
    // (we should only have one per site, so we only need one here)
    let systemMessage = server.schema.systemMessages.first();
    if (systemMessage) {
      productBanner.update({systemMessage});
      systemMessage.productBanners.add(productBanner);
    }
  }
});
