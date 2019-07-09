import moment from 'moment';
import { Factory, faker/*, trait*/ } from 'ember-cli-mirage';

import {
  CMS_TIMESTAMP_FORMAT
} from './consts';

export default Factory.extend({
  body: () => ([
    {
      type: 'paragraph',
      value: `<p>${faker.lorem.paragraphs(4).split("\n ").join('</p><p>')}</p>`,
      id: faker.random.uuid(),
    }
  ]),

  description: faker.lorem.sentences(3),

  disable_comments: false,

  lead_asset: () => ([
    {
      type: 'lead_image',
      value: {
        image: 1283,
        caption: faker.lorem.words(5),
      },
      id: faker.random.uuid(),
    }
  ]),

  listing_title: '',
  listing_summary: '',
  listing_image: null,

  meta: () => ({
    first_published_at: moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),
    type: 'news.ArticlePage',
    detail_url: '',
    html_url: '',
    slug: faker.lorem.words(3).split(' ').join('-'),
    show_in_menus: false,
    seo_title: '',
    search_description: '',
  }),

  publication_date: moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),

  updated_date: null,

  related_authors: () => ([
    {
      id: 46,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      job_title: faker.name.jobTitle(),
      biography: "",
      website: "",
      email: "",
    }
  ]),
  related_contributing_organizations: () => ([]),
  related_sponsors: () => ([]),
  related_links: () => ([]),

  sensitive_content: false,

  show_as_feature: false,

  show_on_index_listing: true,

  sponsored_content: false,

  social_image: null,
  social_title: '',
  social_text: '',

  tags: () => ([]),

  title: () => faker.random.words(6),
});
