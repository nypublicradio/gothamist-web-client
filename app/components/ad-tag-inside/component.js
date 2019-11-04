import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { and, not } from '@ember/object/computed';
import insertAdDiv from '../../utils/insert-ad-div';

export default Component.extend({
  tagName: '',

  fastboot: service(),
  sensitive: service('ad-sensitivity'),

  wormholeDestination: "",

  notFastBoot: not('fastboot.isFastBoot'),
  notSensitive: not('sensitive.on'),
  shouldRender: and('wormholeDestination', 'notFastBoot', 'notSensitive'),

  actions: {
    handleWillRender() {
      this.set('wormholeDestination', null);
    },

    handleDidRender() {
      let targetDiv = document.querySelector('.c-article__body');
      let insertedDiv = this.target =  insertAdDiv('inserted-target', targetDiv);
      this.set('wormholeDestination', insertedDiv);
    },
  }
});
