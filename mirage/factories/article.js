import moment from 'moment';
import { Factory, faker, trait } from 'ember-cli-mirage';

import {
  CMS_TIMESTAMP_FORMAT,
  slug,
  section,
} from './consts';


export default Factory.extend({
  // mirage-only attrs
  section,
  html_path() {
    return this.meta && this.meta.html_url;
  },

  ancestry() {
    return [{
      id: faker.random.number(100, 300),
      meta: {
        type: 'news.ArticleIndex',
        detail_url: 'http://localhost/api/v2/pages/12/',
        html_url: 'http://localhost/news/articles/',
      },
      title: 'Articles',
      slug: 'articles',
    }, {
      id: faker.random.number(300, 500),
      meta: {
        type: 'standardpages.IndexPage',
        detail_url: 'http://localhost/api/v2/pages/8/',
        html_url: 'http://localhost/news/',
      },
      title: this.section[0].toUpperCase() + this.section.slice(1),
      slug: this.section,
    }, {
      id: faker.random.number(500, 700),
      meta: {
        type: 'home.HomePage',
        detail_url: 'http://localhost/api/v2/pages/3/',
        html_url: 'http://localhost/',
      },
      title: 'Home',
      slug: 'home',
    }, {
      id: 1,
      meta: {
        type: 'wagtailcore.Page',
        detail_url: 'http://localhost/api/v2/pages/1/',
        html_url: null,
      },
      title: 'Root',
      slug: 'root',
    }];
  },
  body() {
    let copy = this.text || faker.lorem.paragraphs(4).split("\n ").join('</p><p>');
    return [{
      type: 'paragraph',
      value: `<p>${copy}</p>`,
      id: faker.random.uuid(),
    }];
  },

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

  legacy_id: () => faker.random.number(50000, 80000),

  listing_title: '',
  listing_summary: '',
  listing_image: null,

  meta() {
    const SLUG = this.slug || slug();
    const SECTION = this.section || section();
    return {
      first_published_at: moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),
      type: 'news.ArticlePage',
      detail_url: '',
      html_url: `${SECTION}/${SLUG}/`, // used to derive path for now
      slug: SLUG,
      show_in_menus: false,
      seo_title: '',
      search_description: '',
    };
  },

  publication_date: () => moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),

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
      slug: slug(),
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

  now: trait({
    publication_date: moment.utc().format(CMS_TIMESTAMP_FORMAT),
  }),
});
