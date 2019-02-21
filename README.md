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

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

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
