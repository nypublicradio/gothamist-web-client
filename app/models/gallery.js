import DS from 'ember-data';

// this will be a problem when the models are moved out
import { wagtailImageUrl } from 'ember-wagtail-images';

import { computed } from '@ember/object';

import Page from './page';


const HEIGHT = 'height';
const WIDTH = 'width';
const FILL = 'fill';
const COVER = 'cover';
const CONTAIN = 'contain';
const FITS = [FILL, COVER, CONTAIN];

export default Page.extend({
  // slides are normalized from the server to look like so:
  // {
  //   title String,
  //   image Object{id Number, caption String},
  // }
  slides: DS.attr({deafultValue: () => []}),

  relatedAuthors:                   DS.attr({defaultValue: () => []}),
  relatedContributingOrganizations: DS.attr({defaultValue: () => []}),

  // relationships
  relatedArticles: DS.hasMany('article'),

  // computeds
  authors: computed('relatedAuthors', function() {
    return this.relatedAuthors.map(author => ({
      name: `${author.first_name} ${author.last_name}`,
      route: ['author-detail', author.slug],
    }));
  }),

  makeSizes(ops = {}, others = {}) {
    return this.slides.map(slide => {
      let sizes = Object.keys(ops)
        .reduce((o, key) => ({
          ...o,
          [key]: wagtailImageUrl([slide.image, ...deriveWagtailArgs(ops[key])]),
        }), {})
      // sizes = Object.fromEntries(sizes);
      return {
        title: slide.title,
        caption: slide.image.caption,
        ...sizes,
        ...others,
      };
    })
  }
});

function deriveWagtailArgs(val) {
  let args;
  if (Array.isArray(val)) {
    if (val.length === 2) {
      let [ dimension, fit ] = val;
      if (FITS.includes(fit)) {
        args = [
          dimension,
          dimension,
          fit,
        ]; // crop to square with given fit
      } else if (fit === HEIGHT) {
        args = [
          null,
          dimension,
          fit,
        ]; // resize height to dimension
      } else if (fit === WIDTH) {
        args = [
          dimension,
        ];
      }
    }

    if (!args) {
      args = val;
    }
  } else {
    args = [val];
  }

  return args;
}
