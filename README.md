# gothamist-web-client

This is the ember web client for gothamist.com. Most of the components and styles are provided by the [`nypr-design-system`](https://github.com/nypublicradio/nypr-design-system).

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone git@github.com:nypubliradio/gothamist-web-client` this repository
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
