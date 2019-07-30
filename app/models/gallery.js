import DS from 'ember-data';

import { computed } from '@ember/object';

import Page from './page';

export default Page.extend({
  // slides are normalized from the server to look like so:
  // {
  //   title String,
  //   image Object{id Number, caption String},
  // }
  slides: DS.attr(),

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
});
