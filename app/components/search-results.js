import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    window.__gcse.finished.then(() => {
      google.search.cse.element.render({
        div: 'search',
        gname: 'search',
        tag: 'searchresults-only', // type of google cse element to render
        attributes: {
          autoSearchOnLoad: false,
        }
      })

      this.set('google', google.search.cse.element.getElement('search'));

      this.google.execute(this.query);
    });
  },

  didRender() {
    if (this.google) {
      this.google.execute(this.query);
    }
  }
});
