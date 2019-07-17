import moment from 'moment';
import { Factory, faker } from 'ember-cli-mirage';

import { COUNT } from 'gothamist-web-client/routes/sections';

import {
  CMS_TIMESTAMP_FORMAT,
  slug
} from './consts';


export default Factory.extend({
  meta: () => ({
    first_published_at: moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),
    type: "standardpages.IndexPage",
    detail_url: "http://cms.demo.nypr.digital/api/v2/pages/5/",
    html_url: "http://cms.demo.nypr.digital/news/",
    slug: slug(),
    show_in_menus: true,
    seo_title: "",
    search_description: "",
    parent: {
      id: 3,
      meta: {
        type: "home.HomePage",
        detail_url: "http://cms.demo.nypr.digital/api/v2/pages/3/",
        html_url: "http://cms.demo.nypr.digital/"
      },
      title: "Home"
    }
  }),
  title: () => faker.random.words(6),
  listing_title: "",
  listing_summary: "",
  listing_image: null,
  social_image: null,
  social_title: "",
  social_text: "",
  show_on_index_listing: true,

  // for section pages
  afterCreate(page, server) {
    if (!page.descendants.length) {
      page.update({
        descendants: server.createList('article', COUNT * 2, {
          indexPage: page,
          _section: page.meta.slug
        }),
      });
    }
  }
});
