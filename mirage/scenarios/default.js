export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('article', {tags: ['@main'], permalink: 'foo', title: 'test homepage article'});
  server.createList('article', 3, {
    tags: ['@main']
  });
}
