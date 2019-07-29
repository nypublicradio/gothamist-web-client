import DS from 'ember-data';

import Page from './page';

export default Page.extend({
  slides: DS.attr(),

  relatedAuthors:                   DS.attr({defaultValue: () => []}),
  relatedContributingOrganizations: DS.attr({defaultValue: () => []}),

  // relationships
  relatedArticles: DS.hasMany('article'),
});
