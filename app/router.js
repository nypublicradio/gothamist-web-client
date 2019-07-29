import EmberRouter from '@ember/routing/router';
import { inject } from '@ember/service';
import config from './config/environment';

const Router = EmberRouter.extend({
  headData: inject(),
  location: config.locationType,
  rootURL: config.rootURL,

  setTitle(title) {
    this.headData.set('title', title);
  }
});

Router.map(function() {
  this.route('404', {path: '*wildcard'});
  this.route('500', {path: '*other-error'});

  this.route('article', {path: ':section/*path'});

  this.route('search');
  this.route('tags', {path: 'tags/:tag'});
  this.route('popular');
  this.route('staff');
  this.route('sections', {path: ':section'});
  this.route('author-detail', {path: 'author/:name'});

  this.route('contact');
});

export default Router;
