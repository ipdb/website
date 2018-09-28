/* eslint-disable no-console */
import fs from 'fs'
import cp from 'child_process'
import { src, dest, watch, parallel, series } from 'gulp'
import del from 'del'
import parallelize from 'concurrent-transform'
import browser from 'browser-sync'
import critical from 'critical'
import yaml from 'js-yaml'
import request from 'request'
import chalk from 'chalk'
import minimist from 'minimist'

// required to get our mix of old and ES6+ js to work with ugify-js 3
import uglifyjs from 'uglify-es'
import composer from 'gulp-uglify/composer'

// get all the configs: `pkg` and `site`
import pkg from './package'

// load plugins
const $ = require('gulp-load-plugins')()

const minify = composer(uglifyjs, console)
const site = yaml.safeLoad(fs.readFileSync('./_config.yml'))

// handle errors
const onError = (error) => {
    console.log(chalk.red('\nYou fucked up:', error.message, 'on line', error.lineNumber, '\n'))
    this.emit('end')
}

// 'development' is just default, production overrides are triggered
// by adding the production flag to the gulp command e.g. `gulp build --production`
const options = minimist(process.argv.slice(2))

const isProduction = options.production === true
const isStaging = options.staging === true


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Config
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Port to use for the development server
const PORT = 1337

// paths
const SRC = `${site.source}/`
const DIST = `${site.destination}/`

// deployment
const S3BUCKET = 'ipdb.io'
const S3REGION = 'eu-central-1'
const S3BUCKET_BETA = 'beta.ipdb.io'
const S3REGION_BETA = 'eu-central-1'

// SVG sprite
const SPRITECONFIG = {
    dest: `${DIST}assets/img/`,
    mode: {
        symbol: {
            dest: './',
            sprite: 'sprite.svg'
        }
    }
}

// code banner
const BANNER = [
    '/**',
    ' ** <%= pkg.name %>',
    ' ** <%= pkg.description %>',
    ' ** <%= pkg.homepage %>',
    ' **',
    ' ** <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' **/',
    ''
].join('\n')


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Tasks
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Delete build artifacts
//
export const clean = () =>
    del([
        `${DIST}**/*`,
        `${DIST}.*` // delete all hidden files
    ])


//
// Jekyll
//
export const jekyll = (done) => {
    browser.notify('Compiling Jekyll')

    let jekyllOptions

    if (isProduction) {
        process.env.JEKYLL_ENV = 'production'
        jekyllOptions = 'jekyll build'
    } else if (isStaging) {
        process.env.JEKYLL_ENV = 'staging'
        jekyllOptions = 'jekyll build'
    } else {
        process.env.JEKYLL_ENV = 'development'
        jekyllOptions = 'jekyll build --incremental --drafts --future'
    }

    const jekyllInstance = cp.execFile('bundle', ['exec', jekyllOptions], { stdio: 'inherit' })

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => console.log(message))
    }

    jekyllInstance.stdout.on('data', jekyllLogger).on('close', done)
}


//
// HTML
//
export const html = () => src(`${DIST}**/*.html`)
    .pipe($.if(isProduction || isStaging, $.htmlmin({
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        useShortDoctype: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyJS: true,
        minifyCSS: true
    })))
    .pipe(dest(DIST))


//
// Styles
//
export const css = () => src([
    `${SRC}_assets/scss/ipdb.scss`,
    `${SRC}_assets/scss/page-*.scss`
])
    .pipe($.if(!(isProduction || isStaging), $.sourcemaps.init()))
    .pipe($.sass({
        includePaths: ['node_modules']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.if(isProduction || isStaging, $.cleanCss()))
    .pipe($.if(!(isProduction || isStaging), $.sourcemaps.write()))
    .pipe($.if(isProduction || isStaging, $.header(BANNER, { pkg })))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(dest(`${DIST}assets/css/`))
    .pipe(browser.stream())

// inline critical-path CSS
export const criticalCss = (done) => {
    if (isProduction || isStaging) {
        critical.generate({
            base: DIST,
            src: 'index.html',
            dest: 'index.html',
            inline: true,
            minify: true,
            dimensions: [{
                height: 320,
                width: 640
            }, {
                height: 600,
                width: 800
            }, {
                height: 900,
                width: 1360
            }]
        })
    }
    done()
}


//
// JavaScript
//
export const js = () =>
    src([
        `${SRC}_assets/js/ipdb.js`,
        `${SRC}_assets/js/page-*.js`
    ])
        .pipe($.if(!(isProduction || isStaging), $.sourcemaps.init()))
        .pipe($.include({
            includePaths: ['node_modules', `${SRC}_assets/js`]
        })).on('error', onError)
        .pipe($.if(isProduction || isStaging, minify()))
        .on('error', onError)
        .pipe($.if(!(isProduction || isStaging), $.sourcemaps.write()))
        .pipe($.if(isProduction || isStaging, $.header(BANNER, { pkg })))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(dest(`${DIST}assets/js/`))


//
// SVG sprite
//
export const svg = () => src(`${SRC}_assets/img/*.svg`)
    .pipe($.if(isProduction || isStaging, $.imagemin({
        svgoPlugins: [{ removeRasterImages: true }]
    })))
    .pipe($.svgSprite(SPRITECONFIG))
    .pipe(dest(`${DIST}assets/img/`))


//
// Copy Images
//
export const images = () => src(`${SRC}_assets/img/**/*`)
    .pipe($.if(isProduction || isStaging, $.imagemin([
        $.imagemin.gifsicle({ interlaced: true }),
        $.imagemin.jpegtran({ progressive: true }),
        $.imagemin.optipng({ optimizationLevel: 5 }),
        $.imagemin.svgo({ plugins: [{ removeViewBox: true }] })
    ])))
    .pipe(dest(`${DIST}assets/img/`))


//
// Revision static assets
//
export const rev = (done) => {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction || isStaging) {
        return src(`${DIST}assets/**/*.{css,js,png,jpg,jpeg,svg,eot,ttf,woff,woff2}`)
            .pipe($.rev())
            .pipe(dest(`${DIST}assets/`))
            // output rev manifest for next replace task
            .pipe($.rev.manifest())
            .pipe(dest(`${DIST}assets/`))
    }
    done()
}


//
// Replace all links to assets in files
// from a manifest file
//
export const revReplace = (done) => {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction || isStaging) {
        const manifest = src(`${DIST}assets/rev-manifest.json`)

        return src(`${DIST}**/*.{html,css,js}`)
            .pipe($.revReplace({ manifest }))
            .pipe(dest(DIST))
    }
    done()
}


//
// Dev Server
//
export const server = (done) => {
    browser.init({
        server: DIST,
        port: PORT,
        reloadDebounce: 2000
    })
    done()
}


//
// Watch for file changes
//
export const watchSrc = () => {
    watch(`${SRC}_assets/scss/**/*.scss`).on('all', series(css))
    watch(`${SRC}_assets/js/**/*.js`).on('all', series(js, browser.reload))
    watch(`${SRC}_assets/img/**/*.{png,jpg,jpeg,gif,webp}`).on('all', series(images, browser.reload))
    watch(`${SRC}_assets/img/**/*.{svg}`).on('all', series(svg, browser.reload))
    watch([
        `${SRC}**/*.{html,xml,json,txt,md,yml}`,
        './*.yml',
        `${SRC}_includes/svg/*`
    ]).on('all', series('build', browser.reload))
}


//
// Build banner
//
/* eslint-disable max-len */
const buildBanner = (done) => {
    let buildEnvironment

    if (isProduction) {
        buildEnvironment = 'production'
    } else if (isStaging) {
        buildEnvironment = 'staging'
    } else {
        buildEnvironment = 'dev'
    }

    console.log(chalk.gray('         ------------------------------------------'))
    console.log(chalk.green(`                Building ${buildEnvironment} version...`))
    console.log(chalk.gray('         ------------------------------------------'))

    done()
}


//
// Deploy banner
//
const deployBanner = (done) => {
    let deployTarget

    if (options.live) {
        deployTarget = 'Live'
    } else {
        deployTarget = 'Beta'
    }

    if ((options.live || options.beta || options.gamma) === true) {
        console.log(chalk.gray('        ------------------------------------------'))
        console.log(chalk.green(`                    Deploying to ${deployTarget}... `))
        console.log(chalk.gray('        ------------------------------------------'))
    } else {
        console.log(chalk.red('\nHold your horses! You need to specify a deployment target like so: gulp deploy --beta. Possible targets are: --live, --beta, --gamma\n'))
    }
    done()
}
/* eslint-enable max-len */


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Collection tasks
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Full build
//
// `gulp build` is the development build
// `gulp build --production` is the production build
//
export const build = series(
    buildBanner, clean, jekyll,
    parallel(html, css, js, images, svg),
    rev, revReplace, criticalCss
)

//
// Build site, run server, and watch for file changes
//
// `gulp dev`
//
export const dev = series(build, server, watchSrc)

// Set `gulp dev` as default: `gulp`
export default dev


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Deployment
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// gulp deploy --live
// gulp deploy --beta
// gulp deploy --gamma
//
export const s3 = () => {
    // create publisher, define config
    let publisher

    if (options.live === true) {
        publisher = $.awspublish.create({
            'params': { 'Bucket': S3BUCKET },
            'accessKeyId': process.env.AWS_ACCESS_KEY,
            'secretAccessKey': process.env.AWS_SECRET_KEY,
            'region': S3REGION
        })
    } else if (options.beta === true) {
        publisher = $.awspublish.create({
            'params': { 'Bucket': S3BUCKET_BETA },
            'accessKeyId': process.env.AWS_BETA_ACCESS_KEY,
            'secretAccessKey': process.env.AWS_BETA_SECRET_KEY,
            'region': S3REGION_BETA
        })
    } else {
        return
    }

    src(`${DIST}**/*`)
        .pipe($.awspublishRouter({
            cache: {
                // cache for 5 minutes by default
                cacheTime: 300
            },
            routes: {
                // all static assets, cached & gzipped
                '^assets/(?:.+)\\.(?:js|css|png|jpg|jpeg|gif|ico|svg|ttf|eot|woff|woff2)$': {
                    cacheTime: 2592000, // cache for 1 month
                    gzip: true
                },

                // every other asset, cached
                '^assets/.+$': {
                    cacheTime: 2592000 // cache for 1 month
                },

                // all html files, not cached & gzipped
                '^.+\\.html': {
                    cacheTime: 0,
                    gzip: true
                },

                // all pdf files, not cached
                '^.+\\.pdf': {
                    cacheTime: 0
                },

                // font mime types
                '.ttf$': {
                    key: '$&',
                    headers: { 'Content-Type': 'application/x-font-ttf' }
                },
                '.woff$': {
                    key: '$&',
                    headers: { 'Content-Type': 'application/x-font-woff' }
                },
                '.woff2$': {
                    key: '$&',
                    headers: { 'Content-Type': 'application/x-font-woff2' }
                },

                // pass-through for anything that wasn't matched by routes above,
                // to be uploaded with default options
                '^.+$': '$&'
            }
        }))
        .pipe(parallelize(publisher.publish(), 100)).on('error', onError)
        .pipe(publisher.sync()) // delete files in bucket that are not in local folder
        .pipe($.awspublish.reporter({
            states: ['create', 'update', 'delete']
        }))
}


//
// Ping search engines on live deployment
//
export const seo = (done) => {
    const googleUrl = 'http://www.google.com/webmasters/tools/ping?sitemap='
    const bingUrl = 'http://www.bing.com/webmaster/ping.aspx?siteMap='

    const showResponse = (error, response) => {
        if (error) {
            console.log(chalk.red(error))
        } else {
            console.log(chalk.gray('Status:', response && response.statusCode))

            if (response.statusCode === 200) {
                console.log(chalk.green('Successfully notified'))
            }
        }
    }

    if (options.live === true) {
        request(`${googleUrl + site.url}/sitemap.xml`, showResponse)
        request(`${bingUrl + site.url}/sitemap.xml`, showResponse)
    }

    done()
}


//
// `gulp deploy`
//
export const deploy = series(deployBanner, s3, seo)
