export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('story', {tags: ['@main'], permalink: 'foo', title: 'test homepage story'});
  server.createList('story', 3, {
    tags: ['@main']
  });
}
