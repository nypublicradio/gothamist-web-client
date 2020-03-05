import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { and, not } from '@ember/object/computed';
import insertAdDiv from '../../utils/insert-ad-div';
import config from 'gothamist-web-client/config/environment';

export default Component.extend({
  tagName: '',

  fastboot: service(),
  sensitive: service('ad-sensitivity'),

  wormholeDestination: null,
  containerSelector: null,

  notFastBoot: not('fastboot.isFastBoot'),
  notSensitive: not('sensitive.on'),
  shouldRender: and('wormholeDestination', 'notFastBoot', 'notSensitive'),

  isEager: (!config.lazyLoadAds),

  actions: {
    handleDidRender() {
      let containerSelector = this.containerSelector || '.c-article__body';
      let targetDiv = document.querySelector(containerSelector);
      let insertedDiv = this.target =  insertAdDiv('inserted-ad', targetDiv);
      this.set('wormholeDestination', insertedDiv);
    },
  }
});
