'use strict';

module.exports = {
  name: require('./package').name,

  contentFor(type) {
    if (type === 'head-footer') {
      return `
      <script>
        window.__gcse = {
          parsetags: 'explicit',
          callback() {
            window.__gcse.resolve();
          }
        };
        window.__gcse.finished = new Promise(resolve => window.__gcse.resolve = resolve);

        (function() {
          var cx = '${process.env.GOOGLE_CSE_ID}';
          var gcse = document.createElement('script');
          gcse.type = 'text/javascript';
          gcse.async = true;
          gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(gcse, s);
        })();
      </script>
      `.trim();

    }
  },

  isDevelopingAddon() {
    return true;
  }
};
