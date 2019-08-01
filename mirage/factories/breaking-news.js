import { Factory, faker } from 'ember-cli-mirage';
import { capitalize } from '@ember/string'
import moment from 'moment';
import { CMS_TIMESTAMP_FORMAT } from './consts';

export default Factory.extend({
  id:() => faker.random.uuid(),
  type: 'breaking-news',
  title: () => capitalize(faker.lorem.words()),
  link: () => faker.internet.url(),
  description: () => `<p>${faker.lorem.sentence(5)}</p>`,
  time: () => moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),
  afterCreate(breakingNews, server) {
    // breaking news gets added to sitewide-components
    let sitewideComponent = server.schema.sitewideComponents.first();
    if (sitewideComponent) {
      breakingNews.update({sitewideComponent});
      sitewideComponent.breakingNews.add(breakingNews);
    }
  }
});
