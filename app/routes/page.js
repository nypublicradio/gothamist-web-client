import Route from '@ember/routing/route';

export default Route.extend({
  resetController(controller) {
    // unset all queryParams when leaving any page route
    controller.queryParams.forEach(v => {
      controller.set(v, null)
    })
  },
});
