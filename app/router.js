import RouterScroll from 'ember-router-scroll';

import EmberRouter from '@ember/routing/router';
import { inject } from '@ember/service';
import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
  headData: inject(),
  location: config.locationType,
  rootURL: config.rootURL,

  setTitle(title) {
    this.headData.set('title', title);
  }
});

Router.map(function() {
  this.route('404', {path: '*'});

  this.route('article', {path: '*any'});
  this.route('search');
  this.route('tags', {path: 'tags/:tag'});
});

export default Router;
