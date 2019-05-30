/* global DISQUS */
import Component from '@ember/component';
import { schedule } from '@ember/runloop';

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

    if (typeof DISQUS !== 'undefined') {
      schedule('afterRender', function() {
        DISQUS.reset({
          reload: true,
          config,
        });
      });
    } else if (!document.querySelector('#disqus-lib')) {
      // if `DISQUS` is undefined AND check for `#disqus-lib`. if it exists, there's probably
      // and ad blocker at work, so we only want to try to load the disqus script if it hasn't been
      // attempteed already
      window.disqus_config = config;
      var disqusLib = document.createElement('script');
      disqusLib.id = 'disqus-lib';
      disqusLib.src = 'https://gothamist.disqus.com/embed.js';
      disqusLib.async = true;
      document.head.appendChild(disqusLib);
    }

  }
});
