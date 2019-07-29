import { Factory, faker } from 'ember-cli-mirage';
import { capitalize } from '@ember/string'

export default Factory.extend({
  id() {
    return faker.random.uuid();
  },
  type: 'breaking-news',
  title() {
    return capitalize(faker.lorem.words());
  },
  link() {
    return faker.internet.url();
  },
  description() {
    return `<p>${faker.lorem.sentence(5)}</p>`;
  },
  afterCreate(breakingNews, server) {
    // breaking news gets added to sitewide-components
    let sitewideComponent = server.schema.sitewideComponents.first();
    if (sitewideComponent) {
      breakingNews.update({sitewideComponent});
      sitewideComponent.breakingNews.add(breakingNews);
    }
  }
});
