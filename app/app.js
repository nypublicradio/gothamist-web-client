import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { InitSentryForEmber } from '@sentry/ember';

InitSentryForEmber();

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

export default App;

loadInitializers(App, config.modulePrefix);
