import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { wagtailImageUrl } from 'ember-wagtail-images';

import { SLIDES } from '../fixtures/gallery-fixtures';

module('Unit | Model | gallery', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('gallery', {});
    assert.ok(model);
  });

  test('it can produce slide sizes on demand', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('gallery', {
      slides: SLIDES,
    });

    const slides = model.makeSizes({
      // nothing special about these sizes
      // each slide is given a fully-qualified URL for each key
      // based on the param values passed in

      // simple case: 1 number == resize width
      // same as [150, 'width']
      thumb: 150,

      // two-item array: [dimension, fit]
      srcS:  [400, 'height'],

      // two-item array: [dimension, fit !== height or width]
      // crop to a square
      srcM:  [800, 'fill'],

      // three-item array: [width, height, fit !== height or width]
      // crop to width and height using provided fit
      srcL:  [1200, 1000, 'cover'],
    }, {
      // the second object is an arbitrary list of key/values
      // that can be added to a slide
      width: 1200,
    });

    slides.forEach((slide, i) => {
      assert.deepEqual(slide, {
        title: model.slides[i].title,
        caption: model.slides[i].image.caption, // always brings in the caption
        width: 1200, // include the abitrary values
        thumb: wagtailImageUrl([model.slides[i].image, 150]), // width-150
        srcS: wagtailImageUrl([model.slides[i].image, null, 400]), // height-400
        srcM: wagtailImageUrl([model.slides[i].image, 800, 800]), // fill-800x800
        srcL: wagtailImageUrl([model.slides[i].image, 1200, 1000, 'cover']), // min-1200x1000
      })
    })
  });
});
