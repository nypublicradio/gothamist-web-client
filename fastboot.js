const fastboot = require('nypr-fastboot');

const server = fastboot({
  bucket: process.env.AWS_BUCKET,
  manifestKey: process.env.FASTBOOT_MANIFEST,
  sentryDSN: process.env.SENTRY_DSN,
  env: process.env.ENV,
  serviceName: process.env.SERVICE_NAME,
  fastbootConfig: {resilient: true,
                   distPath: process.env.DIST_PATH}
});

server.start();
