import moment from 'moment';
import { Factory, faker } from 'ember-cli-mirage';

import { GALLERY_PATH } from 'gothamist-web-client/router';

import {
  CMS_TIMESTAMP_FORMAT,
  slug,
  section,
} from './consts';


export default Factory.extend({
  // mirage-only attrs
  count: 5, // slide count
  section,
  html_path() {
    return this.meta && this.meta.html_url;
  },

  description: faker.lorem.sentences(3),

  listing_image: null,
  listing_summary: '',
  listing_title: '',

  meta() {
    const SLUG = this.slug || slug();
    const SECTION = this.section || section();
    return {
      first_published_at: moment.utc(faker.date.recent()).format(CMS_TIMESTAMP_FORMAT),
      type: 'gallery.GalleryPage',
      detail_url: '',
      html_url: `${SECTION}/${GALLERY_PATH}/${SLUG}/`, // used to derive path for now
      slug: SLUG,
      show_in_menus: false,
      seo_title: '',
      search_description: '',
    };
  },

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

  show_on_index_listing: true,

  slides() {
    let slides = [];
    for (let i = 0; i < this.count; i ++) {
      slides.push({
        type: 'image_slide',
        value: {
          slide_title: faker.lorem.words(2),
          slide_image: {
            image: {
              id: faker.random.number(5000),
            },
            caption: faker.lorem.sentence(),
          },
        },
        id: faker.random.uuid(),
      });
    }
    return slides;
  },

  social_image: null,
  social_title: '',
  social_text: '',

  title: () => faker.random.words(6),
});
