# gothamist-web-client

[![Maintainability](https://api.codeclimate.com/v1/badges/db8f5caa65b32075199e/maintainability)](https://codeclimate.com/github/nypublicradio/gothamist-web-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/db8f5caa65b32075199e/test_coverage)](https://codeclimate.com/github/nypublicradio/gothamist-web-client/test_coverage)

This is the ember web client for gothamist.com. Most of the components and styles are provided by the [`nypr-design-system`](https://github.com/nypublicradio/nypr-design-system).

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone git@github.com:nypubliradio/gothamist-web-client.git` this repository
* `cd gothamist-web-client`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

`ember-cli-mirage` is disabled by default, but you run a local dev server with the following:
```
$ MIRAGE=1 ember serve
```

It can be `MIRAGE=<any truthy value>` to start enable mirage with that local server instance.

### Running the fastboot app server

* Ensure sure you have AWS credentials set up locally. Contact devops for help with this.
* Specify `AWS_BUCKET` in your `.env` file
* Run `$ npm fastboot`

The local fastboot server will download the latest fastboot build from the S3 bucket specified in your `.env` file and start it up on port 3000. It will behave as a deployed fastboot server, which means it will only respond to HTTP requests that include an `Accept: text/html` header.


### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `yarn lint:hbs`
* `yarn lint:js`
* `yarn lint:js --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Deployments are handled by `ember-cli-deploy` and associated plugins. Commits are pushed to our CircleCI account, where tests are run every time. CircleCI will also run deployments.

Commits to master (and merged pull requests) will deploy to [https://gothamist-client.demo.nypr.digital](https://gothamist-client.demo.nypr.digital).

Branches that follow the pattern `/[A-Za-z-_]+\/[A-Za-z-_\d]+/` will deploy a QA build. You can read more on QA builds [here](https://wiki.nypr.digital/display/DT/Web+Clients).

### CloudFront

CloudFront forwards requests to `assets/*`, `fonts/*`, and `static-images/*` back to the S3 bucket, so any static assets that that part of the source can be saved in `public/fonts/*` or `public/static-images/` for public access.

#### Manual Static Deploys

The ember app can be deployed locally by running `ember deploy [deploy target]`, where `[deploy target]` is one of:
- `demo`
- `prod`

It will build with any values specified in your `.env` file, so make sure it's got the correct values for your target environment.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)


### Nginx

The production/demo fastboot clients sit behind an Nginx reverse proxy.
Nginx runs alongside the fastboot application within the same container.
Both processes are managed by [supervisord](http://supervisord.org/).
The supervisord config is `nginx/supervisord.conf`.

Nginx handles a series of legacy re-redirects ported from the pre-NYPR
frontend Apache config. These can be found in `nginx/nginx.conf`.

Nginx also provides a 1s cache to rate-limit requests to the fastboot app,
this should help relieve the 'thundering herd' effect caused by cache invalidation.

A set of tests for Nginx rules is available in `scripts/test_nginx.sh`.
To run the tests: build the Docker image and run the script from a container.
```bash
docker build -t gothamist-web-client .
docker run gothamist-web-client ./scripts/test_nginx.sh
```

## Notes

### `store.queryRecord('article')` throws a 404

Use `queryRecord` to retrieve a piece of **primary** content, such as for an article detail view. The presumption in this case is that browser URL contains a piece of uniquely identifying information, like a `slug` or an `id`.

Under these circumstances, the semantics dictate that the adapter should throw a `DS.NotFoundError` if the the network request returns a response perceived as empty, and the application **will render a 404 page**.

If you want to make a request that can return empty without rendering a 404 page, use the `query` method on the store. The API is exactly the same, except the returned value will always be a list.

### Newsletter Signups
Use the `opt-in` service to subscribe people to mailchimp newsletters. The `subscribe` end point is described [here](https://github.com/nypublicradio/opt-in#post-v1subscribemailchimp).

### `link-to` params
`link-to` components that are nested within the design system have been built to accept a `params` array instead of the conventional positional params, e.g.
```handlebars
{{#link-to 'article' 'my-article-identifier'}}`
  My Article
{{/link-to}}
```

`link-to` components accept a `params` argument that is an array of values identical to the positional params, so most `link-to` invocations look like this: `{{link-to params=@params}}`, where `@params` is usually passed in like so:
```handlebars
<MyDesignSystemComponent
  @routeParams={{array 'article' 'my-article-identifier'}}
/>
```

This syntax also accepts query params, but with slightly more plumbing involved:
```handlebars
<MyDesignSystemComponent
  @routeParams={{array 'article' 'my-article-identifier' (hash isQueryParams=true values=(hash to='comments'))}}
/>
```
The `link-to` component looks for `isQueyParams` on the final value in the `@params` array, and then uses whatever is at the `values` key to construct query params for the link. It's weird, but it works!

### twitter embeds
The twitter embed script is included on the index page. It seems to allow for better async handling of rendering embedded tweets.

### pattern lab
Pattern lab styles are built by the pattern lab repo at [https://github.com/nypublicradio/pattern-lab]. When a new release is cut, the CSS is compiled and shipped to prod infra for the gothamist web client.

The `pattern-lab-styles` in repo addon controls the path to the styles included in the index file.

- When deploying, the path is root-relative
- When in development, the path is absolute to SouthLeft's staging server
- When `LOCAL_STYLES` is set in `.env`, the path is to a local pattern lab server, set to point to `localhost:8020`
