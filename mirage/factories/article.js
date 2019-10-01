import moment from 'moment';
import { Factory, faker, trait } from 'ember-cli-mirage';

import {
  CMS_TIMESTAMP_FORMAT,
  slug,
  section,
} from './consts';


export default Factory.extend({
  // mirage-only attrs
  slug,
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
        image: {
          id: 1283,
          credit: faker.name.findName(),
          credit_link: faker.internet.url(),
        },
        caption: faker.lorem.words(5),
        image_link: faker.internet.url(),
      },
      id: faker.random.uuid(),
    }
  ]),

  listing_image: null,
  listing_summary: '',
  listing_title: '',

  meta() {
    return {
      first_published_at: moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),
      type: 'news.ArticlePage',
      detail_url: '',
      html_url: `${this.section}/${this.slug}/`, // used to derive path for now
      slug: this.slug,
      show_in_menus: false,
      seo_title: '',
      search_description: '',
    };
  },

  publication_date: () => moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),

  provocative_content: false,

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

  uuid: () => faker.random.uuid(),

  now: trait({
    publication_date: moment.utc().format(CMS_TIMESTAMP_FORMAT),
  }),

  withGallery: trait({
    afterCreate(article, server) {
      const gallery = server.create('gallery', {id: Number(article.id) + 100, count: 8});
      article.update({
        lead_asset: [{
          type: 'lead_gallery',
          value: {
            gallery: gallery.id,
            default_image: {
              id: 1283,
            },
          },
          id: faker.random.uuid(),
        }],
        gallery,
      });
    },
  }),

  withSection: trait({
    afterCreate(article, server) {
      if (article.page) {
        return;
      }
      // does a corresponding section exist?
      let section = server.schema.pages.findBy({ slug: article.section });

      // create one if not with correct attributes
      if (!section) {
        section = server.create('page', {
          slug: article.section,
          title: article.section[0].toUpperCase() + article.section.slice(1),
        });
      }

      // add the current article to the section's descendants
      section.descendants.add(article);
      // make the section this article's index page
      article.update({page: section});
      // client derives the section ID from the `ancestry` key, so make sure the
      // ID is updated there as well
      article.ancestry.findBy('meta.type', 'standardpages.IndexPage').id = section.id;
    }
  })
});
