import moment from 'moment';
import { Factory, faker, trait } from 'ember-cli-mirage';

import { COUNT } from 'gothamist-web-client/routes/sections';

import {
  CMS_TIMESTAMP_FORMAT,
  slug
} from './consts';


export default Factory.extend({
  // mirage-only attrs
  type: "standardpages.IndexPage",
  html_path() {
    return this.meta && this.meta.html_url;
  },

  meta() {
    const SLUG = this.slug || slug();
    return {
      first_published_at: moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),
      type: this.type,
      detail_url: '',
      html_url: `${SLUG}/`,
      slug: SLUG,
      show_in_menus: true,
      seo_title: '',
      search_description: '',
    };
  },
  title: () => faker.random.words(6),
  listing_title: "",
  listing_summary: "",
  listing_image: null,
  social_image: null,
  social_title: "",
  social_text: "",
  show_on_index_listing: true,

  // for section pages
  withArticles: trait({
    afterCreate(page, server) {
      if (!page.descendants.length) {
        page.update({
          descendants: server.createList('article', COUNT * 2, {
            page,
            section: page.meta.slug
          }),
        });
      }
    }
  }),
});
