/* global DISQUS */
import Component from '@ember/component';
import { schedule } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  didInsertElement() {
    this._super(...arguments);

    this._renderDisqus();
  },


  didUpdateAttrs() {
    this._super(...arguments);

    this._renderDisqus();
  },

  _renderDisqus() {

    if (window.block_disqus) {
      // still need to need to call onReady if it's passed
      if (this.onReady) {
        schedule('afterRender', 'onReady');
      }
      return;
    }

    let { identifier, permalink, onReady } = this;
    const config = function() {
      this.page.identifier = identifier;
      this.page.url = permalink;

      if (onReady) {
        // we're the only ones controlling these callbacks
        // just replace it on every init
        this.callbacks.onReady = [onReady];
      }
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

  },
});
