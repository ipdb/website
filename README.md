# ![ipdb/site](.png)

> The blockchain database governance site the universe needs
> https://ipdb.io

🐉🐲 **Highly in development right now, nothing in `master` is final. Content & structure development [happening in Google Doc](https://docs.google.com/a/bigchaindb.com/document/d/1bgQozCf47XGOViYT0KOCwRV2UdPlpeDQh1JuAPaHi-A/edit?usp=sharing)** 🐲🐉

[![Build Status](https://travis-ci.org/ipdb/site.io.svg?branch=master)](https://travis-ci.org/ipdb/site.io)
[![css bigchaindb](https://img.shields.io/badge/css-bigchaindb-39BA91.svg)](https://github.com/bigchaindb/stylelint-config-bigchaindb)
[![js ascribe](https://img.shields.io/badge/js-ascribe-39BA91.svg)](https://github.com/ascribe/javascript)

# Contents

- [Content editing](#content-editing)
  - [Pages](#pages)
  - [Special pages](#special-pages)
    - [Front page](#front-page)
- [Development](#development)
  - [Install dependencies](#install-dependencies)
  - [Development build](#development-build)
- [Continuous deployment: always be shipping](#continuous-deployment-always-be-shipping)
- [Manual deployment](#manual-deployment)
  - [Prerequisite: authentication](#prerequisite-authentication)
  - [Staging build & beta deployment](#staging-build--beta-deployment)
  - [Production build & live deployment](#production-build--live-deployment)
- [Coding conventions](#coding-conventions)
  - [(S)CSS](#scss)
  - [js](#js)
- [Authors & Contributors](#authors--contributors)
- [License](#license)

# Content editing

![unknown](https://user-images.githubusercontent.com/90316/28792395-c1b74594-762f-11e7-8ff6-b49586f39360.jpeg)

Most content on the site can be edited on GitHub without messing with HTML markup.

The site's source and structure is in the [`_src/`](_src) folder. Ignore everything with an underscore in its name.

When viewing a file on GitHub you will see a small pencil icon in the top right. Click that to edit the file.

## Pages

All pages are simple Markdown files. Markdown is a way of telling the site how an element should be marked up, like headings & bold text:

```markdown
I'm a simple paragraph. No fancy symbols needed.

# I'm a heading 1
## I'm a heading 2

You can make text **bold like so**
```

## Special pages

Some pages like front page source their content dynamically during site build. This is so we have a single source of truth for content used in multiple places on the site.

### Front page

Content for all sections on front page is coming from a data file:
- [`_src/_data/content-front.yml`](_src/_data/content-front.yml)


# Development

![200](https://user-images.githubusercontent.com/90316/28792559-56cbe02c-7630-11e7-851f-40192e0ce50a.gif)

You need to have the following tools installed on your development machine before moving on:

- [node.js](http://nodejs.org/) & [npm](https://npmjs.org/)
- (optional) use [Yarn](https://yarnpkg.com) instead of npm for faster dependency installations
- [Ruby](https://www.ruby-lang.org) (for sanity, install with [rvm](https://rvm.io/))
- [Bundler](http://bundler.io/)

## Install dependencies

Run the following command from the repository's root folder to install all dependencies.

```bash
npm i && bundle install
```

or

```bash
yarn && bundle install
```

## Development build

Spin up local dev server and livereloading watch task, reachable under [https://localhost:1337](https://localhost:1337):

```bash
gulp
```

# Continuous deployment: always be shipping

![shipping](https://cloud.githubusercontent.com/assets/90316/26559768/e21e9724-44b1-11e7-90cf-6ef6ebb06d09.gif)

The site gets built & deployed automatically via Travis. This is the preferred way of deployment, it makes sure the site is always deployed with fresh dependencies and only after a successful build.

Build & deployment happens under the following conditions on Travis:

- every push builds the site
- **live deployment**: every push to the master branch initiates a live deployment
- **beta deployment**: every new pull request and every subsequent push to it initiates a beta deployment

# Manual deployment

For emergency live deployments or beta deployments, the manual method can be used. The site is hosted in an S3 bucket and gets deployed via a gulp task.

## Prerequisite: authentication

To deploy the site, you must authenticate yourself against the AWS API with your AWS credentials. Get your AWS access key and secret and add them to `~/.aws/credentials`:

```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

This is all that is needed to authenticate with AWS if you've setup your credentials as the default profile.

If you've set them up as another profile, say `[ipdb]` you can grab those credentials by using the `AWS_PROFILE` variable like so:

```bash
AWS_PROFILE=ipdb gulp deploy --live
```

In case that you get authentication errors or need an alternative way to authenticate with AWS, check out the [AWS documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html).

## Staging build & beta deployment

The staging build is a full production build but prevents search engine indexing & Google Analytics tracking.

```bash
# make sure your local npm packages & gems are up to date
npm update && bundle update

# make staging build in /_dist
# build preventing search engine indexing & Google Analytics tracking
gulp build --staging

# deploy contents of /_dist to beta
gulp deploy --beta
```

## Production build & live deployment

```bash
# make sure your local npm packages & gems are up to date
npm update && bundle update

# make production build in /_dist
gulp build --production

# deploy contents of /_dist to live
gulp deploy --live
```

# Coding conventions

Lint with ESLint & [stylelint](https://stylelint.io) in your editor or run:

```bash
npm test
```

## (S)CSS

Follows [stylelint-config-bigchaindb](https://github.com/bigchaindb/stylelint-config-bigchaindb) which itself extends [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard).

# js

Follows [ascribe/javascript](https://github.com/ascribe/javascript) which itself extends [airbnb/javascript](https://github.com/airbnb/javascript).

# Authors & Contributors

- Greg McMullen ([@gmcmullen](https://github.com/gmcmullen)) - [IPDB Foundation](https://ipdb.foundation)
- Matthias Kretschmann ([@kremalicious](https://github.com/kremalicious)) - [BigchainDB](https://www.bigchaindb.com)
- Members of the IPDB Foundation team
- Members of the BigchainDB development team
- Representatives of Caretakers in the IPDB


# License

For all code in this repository the Apache License, Version 2.0 is applied.

```
Copyright Interplanetary Database Foundation 2017. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
