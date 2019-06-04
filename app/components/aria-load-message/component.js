import Component from '@ember/component';

export default Component.extend({
  tagName: 'p',
  classNames: ['aria-load-message', 'is-vishidden'],

  /**
    Focus on the aria message once loaded. Screenreaders will be aware of new content.
  */
  didRender(){
    let msg = this.element; 
    msg.setAttribute('tabIndex', -1);
    msg.focus();
  },
});
