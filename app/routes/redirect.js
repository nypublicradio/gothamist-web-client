import Route from '@ember/routing/route';


export default Route.extend({
  model({ path }) {
    this.transitionTo('article', {any: path});
  }
})
