import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';
import { computed } from '@ember/object';

import fade from 'ember-animated/transitions/fade';

import addCommentCount from '../utils/add-comment-count';
import { COUNT } from '../routes/sections';

export default Controller.extend({

  COUNT,

  transition: fade,

  query: computed('model', function() {
    // pull off self to allow for test injection
    const { COUNT } = this;

    return {
      descendant_of: this.model.section.id,
      show_on_index_listing: true,
      limit: COUNT,
    };
  }),

  filteredRiver: filter('model.river', ['model.featured'], function(item) {
    return !this.model.featured.includes(item);
  }),

  addComments: results => (addCommentCount(results), results),
});
