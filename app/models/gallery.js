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

  /**
    Generate a map of arbitrary keys to image urls specified by parameters.

    Values of the `ops` param will be interpreted in the following way:
    - Number - resize width according to given value
    - Array[size Number, dimension String('height'|'width')] - resize to given `size` along given `dimension` string
    - Array[size Number, fit String('fill'|'cover'|'contain')] - crop to a square according to `size`, and resize according to `fit`
    - Array[width Number, height Number, fit String('fill'|'cover'|'contain')] - crop to give `width` and `height` according to given `fit`

    @method makeSizes
    @param ops {Object} Object of keynames to parameters passed through to wagtail-image-url
    @param others {Object} Additional key/values to attach to generated slide objects
    @return {Array[Object]}
  */
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
