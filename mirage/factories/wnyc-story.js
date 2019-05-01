import moment from 'moment';

import { Factory, faker } from 'ember-cli-mirage';
import { capitalize } from '@ember/string';

const storyAttrs = (_el, i) => ({
  attributes: {
    url: faker.internet.url(),
    'image-main': {
      template: `https://picsum.photos/600/400?random=${i}`,
      caption: faker.lorem.sentence(),
    },
    title: capitalize(faker.lorem.words()),
    tease: faker.lorem.sentence(15),
    newsdate: moment(faker.date.recent()).format(),
    commentsCount: faker.random.number(200),
  }
});

export default Factory.extend({
  'bucket-items'() {
    return Array.from(new Array(4), storyAttrs);
  },
});
