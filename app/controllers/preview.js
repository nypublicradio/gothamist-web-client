import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['identifier','token'],
  identifier: null,
  token: null,
});
