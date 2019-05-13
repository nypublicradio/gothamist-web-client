export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('article', 'mtGallery', {permalink: 'foo'});
  server.createList('article', 5, {
    tags: ['@main']
  });
  server.create('article', {tags: ['@sponsored']});
  server.createList('article', 50);

  server.create('wnyc-story', {id: 'gothamist-wnyc-crossposting'});
}
