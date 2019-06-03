import moment from 'moment';
import { Factory, faker, trait } from 'ember-cli-mirage';

import {
  DATE_FORMAT,
  PLATYPUS_GALLERY,
  MT_GALLERY,
} from './consts';

export default Factory.extend({
  allow_comments: true,
  author_id: () => faker.random.number({min: 500000, max: 550000}),
  author_name: () => faker.internet.userName(),
  author_nickname: () => faker.name.findName(),
  authored_on: () => moment(faker.date.recent()).format(DATE_FORMAT),
  authored_on_utc() {
    return moment(this.authored_on, DATE_FORMAT).utc().format(DATE_FORMAT);
  },
  blog_id: 1,
  categories: faker.list.random([{
    basename: 'news',
    label: 'News',
  }], [{
    basename: 'arts',
    label: 'Arts & Entertainment',
  }], [{
    basename: 'food',
    label: 'Food',

  }]),
  comment_count: 0,
  entrytopics: () => [],
  excerpt_full: () => faker.lorem.paragraph(7),
  excerpt() {
    return this.excerpt_full.slice(0, 220) + '...';
  },
  excerpt_pretty: () => faker.lorem.sentence(20),
  excerpt_sponsor: null,
  has_gallery: false,
  has_map: false,
  modified_on() {
    return moment(this.authored_on, DATE_FORMAT).add(2, 'h').format(DATE_FORMAT);
  },
  modified_on_utc() {
    return moment(this.authored_on_utc, DATE_FORMAT).add(2, 'h').format(DATE_FORMAT);
  },
  national_title: null,
  path() {
    let slug = faker.lorem.words(3).split(' ').join('_')
    let { authored_on:date } = this;
    date = moment(date, DATE_FORMAT);
    return `${date.format('YYYY')}/${date.format('MM')}/${date.format('DD')}/${slug}.php`;
  },
  permalink() {
    return `http://gothamist.com/${this.path}`;
  },
  platypus_id: () => faker.random.uuid(),
  socialtopics: () => [],
  tags: () => [],

  text: () => faker.lorem.paragraphs(5),
  text_more: null,

  thumbnail_60: () => faker.image.imageUrl(60, 60, 'food', true, true),
  thumbnail_105: () => faker.image.imageUrl(105, 105, 'food', true, true),
  thumbnail_300: () => faker.image.imageUrl(300, 300, 'food', true, true),
  thumbnail_640: () => faker.image.imageUrl(640, 480, 'food', true, true),
  title: () => faker.random.words(6),

  // TRAITS

  sponsored: trait({
    author_name: 'Sponsor',
    author_nickname: 'Sponsor',
    excerpt: () => faker.lorem.sentence() + ' [sponsor]',
    excerpt_full: () => faker.lorem.sentence() + ' [sponsor]',
    excerpt_sponsor: "<div id=\"sponsor-left\"><div class=\"sponsor-title\"><a href=\"http://gothamist.com/2019/02/05/escape_to_a_winter_happy_hour_at_ea_1.php\">Escape To A Winter Happy Hour At Eataly's SERRA ALPINA On The Roof</a></div><div class=\"sponsor-content\">\r\n<br><br><em>This post is brought to you by our sponsor, Eataly.</em></div></div><div id=\"sponsor-right\"><a href=\"http://gothamist.com/2019/02/05/escape_to_a_winter_happy_hour_at_ea_1.php\"><img src=\"http://gothamist.com/attachments/mei/Gothamist_Serra-Alpina_640x250_spon.jpg\"></a></div>",
    tags: [
      '@sponsor',
    ]
  }),

  mtGallery: trait(MT_GALLERY),

  platypusGallery: trait(PLATYPUS_GALLERY),

  wrappedGallery: trait({
    ...PLATYPUS_GALLERY,
    gallery_position: 'default_gallery_template',
    text: () => faker.lorem.paragraphs(1),
    text_more: () => faker.lorem.paragraphs(5),
  }),
});
