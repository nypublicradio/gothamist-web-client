import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['to','identifier','token'],
  to: null,
  identifier: null,
  token: null,
});
