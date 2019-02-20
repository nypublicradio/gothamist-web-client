const fastboot = require('nypr-fastboot');

const server = fastboot({
  bucket: process.env.AWS_BUCKET,
  manifestKey: process.env.FASTBOOT_MANIFEST,
  healthCheckerUA: 'ELB-HealthChecker',
  sentryDSN: process.env.SENTRY_DSN,
});

server.start();
