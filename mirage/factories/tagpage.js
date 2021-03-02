import PageFactory from './page'
import { faker } from 'ember-cli-mirage';

export default PageFactory.extend({
  type: "tagpages.TagPage",
  designed_header: () => ([
    {
      type: 'image',
      value: {
        image: {
          id: 3234,
          credit: faker.name.findName(),
          credit_link: faker.internet.url(),
        },
        caption: faker.lorem.words(5),
        image_link: faker.internet.url(),
      },
      id: faker.random.uuid(),
    }
  ]),
  top_page_zone() {
    let copy = this.text || faker.lorem.paragraphs(4).split("\n ").join('</p><p>');
    return [{
      type: 'paragraph',
      value: `<p>${copy}</p>`,
      id: faker.random.uuid(),
    }];
  },
  midpage_zone() {
    let copy = this.text || faker.lorem.paragraphs(4).split("\n ").join('</p><p>');
    return [{
      type: 'paragraph',
      value: `<p>${copy}</p>`,
      id: faker.random.uuid(),
    }];
  },
});
