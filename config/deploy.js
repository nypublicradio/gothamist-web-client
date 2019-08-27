/* eslint-env node */
'use strict';

const VALID_DEPLOY_TARGETS = [
  'demo',
  'prod',
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: 'production'
    },
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary in order to run ember-cli-deploy-cloudfront.
      // To disable CloudFront invalidation, remove this setting or change it to `false`.
      // To disable ember-cli-deploy-cloudfront for only a particular environment, add
      // `ENV.pipeline.activateOnDeploy = false` to an environment conditional below.
      activateOnDeploy: true
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_DEFAULT_REGION,
    },
    's3-index': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_DEFAULT_REGION,
      allowOverwrite: true,
    },
    'fastboot-app-server-aws': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_DEFAULT_REGION,
    },
    cloudfront: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      distribution: process.env.AWS_CLOUDFRONT_DISTRIBUTION,
      objectPaths: ['/assets/*'], // invalidate all cached fastboot responses
    }
  };

  if (!VALID_DEPLOY_TARGETS.includes(deployTarget) && !deployTarget.startsWith('qa')) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget.startsWith('qa:')) {
    ENV['s3-index'].prefix = deployTarget.replace('qa:', '');
    ENV.pipeline.disabled = {
      'fastboot-app-server': true,
      'fastboot-app-server-aws': true,
    };
  }

  return ENV;
}
