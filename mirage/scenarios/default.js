export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('homepage', 'hasFeaturedCollection');
  server.create('system-message');
  server.create('product-banner');

  server.create('sitewide-component');
  server.create('breaking-news');

  server.createList('article', 5, {
    show_as_feature: true,
  });
  server.create('article', {sponsored_content: true});
  server.createList('article', 50);

  server.create('wnyc-story', {id: 'gothamist-wnyc-crossposting'});
}
