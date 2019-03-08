import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    window.__gcse.finished.then(() => {
      google.search.cse.element.render({
        div: 'search',
        tag: 'search',
        gname: 'search',
        attributes: {
          autoSearchOnLoad: false,
        }
      })

      this.google.execute(this.query);
    });
  },

});
