'use strict'

require(`dotenv`).config()
const { env } = process

const { stripIndent } = require(`common-tags`)

const Koa = require(`koa`)
const createKoaRouter = require(`koa-router`)
const koaSend = require(`koa-send`)
const bodyParser = require(`koa-bodyparser`)

const { graphql, graphiql } = require(`./api`)
const requestGithubToken = require(`./lib/request-github-token`)

const app = new Koa()
const router = createKoaRouter()

const ASSET_CACHE_MAX = 365 * 60 * 60

router.get(/^\/assets(?:\/|$)/, async (ctx) => {
  const assetPath = ctx.path.replace(/assets\//, ``)
  await koaSend(ctx, assetPath, {
    root: `${__dirname}/../../build`,
    maxAge: env.NODE_ENV === `production` ? ASSET_CACHE_MAX : 0,
  })
})

router.post(`/graphql`, graphql)
router.get(`/graphiql`, graphiql)

router.get(`/login`, async (ctx) => {
  if (!ctx.request.query.code) {
    return
  }
  const accessToken = await requestGithubToken(ctx.request.query.code)
  ctx.redirect(`/login-success?access_token=${accessToken}`)
})

const BUNDLE_URL = (env.NODE_ENV === `production`)
  ? `/assets/main.bundle.js`
  : `${env.WEBPACK_DEV_URL}/build/main.bundle.js`
const GITHUB_LOGIN_URL = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${env.APP_URL}/login`
const IFRAME_BUNDLE_URL = (env.NODE_ENV === `production`)
  ? `/assets/iframe.bundle.js`
  : `${env.WEBPACK_DEV_URL}/build/iframe.bundle.js`

router.get(/(?:\/|$)/, async (ctx) => {
  // language=HTML
  ctx.body = stripIndent`
    <!doctype html>
    <html>
      <head>
        <title>Vue.js Component Database</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        ${env.NODE_ENV === `production` ? `<link href="/assets/main.bundle.css" rel="stylesheet">` : ``}
      </head>
      <body>
        <main id="main">
        </main>
        <script>
          window.GITHUB_LOGIN_URL = '${GITHUB_LOGIN_URL}'
          window.IFRAME_BUNDLE_URL = '${IFRAME_BUNDLE_URL}'
        </script>
        <script src="https://unpkg.com/babel-standalone@6.24.0/babel.min.js"></script>
        <script src="${BUNDLE_URL}"></script>
      </body>
    </html>
  `
})

app.use(bodyParser())
app.use(router.routes())
app.listen(env.APP_PORT, env.APP_HOST)
