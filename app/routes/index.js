import Route from '@ember/routing/route';
import fetch from 'fetch';

export default Route.extend({
  model() {
    return fetch('https://api.demo.nypr.digital/topics/search?index=gothamist&term=@main&count=3')
      .then(r => r.json())
      .then(({entries}) => entries);
  }
});
