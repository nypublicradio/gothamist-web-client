import { Factory, faker } from 'ember-cli-mirage';
import { capitalize } from '@ember/string'

export default Factory.extend({
  id: () => faker.random.uuid(),
  type: "product-banner",
  title: () => capitalize(faker.lorem.words()),
  description: () => `<p>${faker.lorem.sentence(5)}</p>`,
  button_text: () => capitalize(faker.lorem.words()),
  button_link: () => faker.internet.url(),
  frequency: 8,
  location: "TOP",
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
