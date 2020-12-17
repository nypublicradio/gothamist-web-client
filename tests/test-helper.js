import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';

/**
 * Stub Sentry init function before application is imported to avoid actually setting up Sentry and needing a DSN
 */
sinon.stub(Sentry, 'init');

setApplication(Application.create(config.APP));

start();
