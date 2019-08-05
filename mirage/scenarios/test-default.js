export default function(server) {
  /*
    Default setup for acceptance tests.
    Only add things that are required for
    all routes here, to avoid adding unneeded
    overhead to every test that uses this scenario.
  */
  server.create('system-message');
}
