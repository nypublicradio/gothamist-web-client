import PageFactory from './page'
import { faker, trait } from 'ember-cli-mirage';

import {
  section,
} from './consts';

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

  hasCollectionInMidpageZone: trait({
    afterCreate(tagpage, server) {
      tagpage.update({
        midpage_zone: [{
          type: 'content-collection',
          id: faker.random.uuid(),
          value: {
            title: "Featured Article Collection",
            id: 10,
            pages: server.createList("article", 5, section, {
              title: faker.list.cycle("Insignificant Blizzard Can't Stop Cronut Fans From Lining Up This Morning", "Gorgeous Mandarin Duck, Rarely Seen In U.S., Mysteriously Appears In Central Park"),
              tags: [{slug: tagpage.slug, name: tagpage.slug.replace('-',' ')}],
              tag_slug: tagpage.slug
            }),
          }
        }]
      })
    },
  }),

  hasCollectionInTopPageZone: trait({
    afterCreate(tagpage, server) {
      tagpage.update({
        top_page_zone: [{
          type: 'content-collection',
          id: faker.random.uuid(),
          value: {
            title: "Featured Article Collection",
            id: 12,
            pages: server.createList("article", 2, section, {
              title: faker.list.cycle("Insignificant Blizzard Can't Stop Cronut Fans From Lining Up This Morning", "Gorgeous Mandarin Duck, Rarely Seen In U.S., Mysteriously Appears In Central Park"),
              tags: [{slug: tagpage.slug, name: tagpage.slug.replace('-',' ')}],
              tag_slug: tagpage.slug
            }),
          }
        }]
      })
    },
  }),
});
