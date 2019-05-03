/* global DISQUS */
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  didInsertElement() {
    this._super(...arguments);

    if (window.block_disqus) {
      return;
    }

    let { identifier, permalink } = this;
    const config = function() {
      this.page.identifier = identifier;
      this.page.url = permalink;
    }

    if (document.querySelector('#disqus-lib')) {
      DISQUS.reset({
        reload: true,
        config,
      });
    } else {
      window.disqus_config = config;
      var disqusLib = document.createElement('script');
      disqusLib.id = 'disqus-lib';
      disqusLib.src = 'https://gothamist.disqus.com/embed.js';
      disqusLib.async = true;
      document.head.appendChild(disqusLib);
    }

  }
});
