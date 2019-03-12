import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    window.__gcse.finished.then(() => {
      google.search.cse.element.render({
        div: 'search', // id of target container
        tag: 'searchresults-only', // type of google cse element to render
        gname: 'search', // google api identifier
        attributes: {
          autoSearchOnLoad: false, // force a fresh execution on every load
        }
      })

      this.set('google', google.search.cse.element.getElement('search'));

      // execute the search on every load
      // the google cse library preserves query params between renders
      // execute the query by hand to ensure any cached state is refreshed
      this.google.execute(this.query);
    });
  },

  didRender() {
    if (this.google) {
      this.google.execute(this.query);
    }
  }
});
