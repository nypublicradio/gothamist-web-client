import Route from '@ember/routing/route';

export default Route.extend({
  model({ any }) {
    return this.store.queryRecord('article', {
      record: any

        }
      }
    })
  },
});
