'use strict'

require(`dotenv`).config()

const { stripIndent } = require(`common-tags`)

const Koa = require(`koa`)
const createKoaRouter = require(`koa-router`)
const koaSend = require(`koa-send`)
const bodyParser = require(`koa-bodyparser`)

const { graphql, graphiql } = require(`./api`)
const requestGithubToken = require(`./lib/request-github-token`)

const app = new Koa()
const router = createKoaRouter()

router.get(/^\/assets(?:\/|$)/, async (ctx) => {
  const assetPath = ctx.path.replace(/assets\//, ``)
  await koaSend(ctx, assetPath, {
    root: `${__dirname}/../../build`,
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

router.get(/(?:\/|$)/, async (ctx) => {
  // language=HTML
  ctx.body = stripIndent`
    <!doctype html>
    <html>
      <head>
        <title>Vue.js Component Database</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      </head>
      <body>
        <main id="main">
          <router-view></router-view> ${``/* why ? */}
        </main>
        <script>
          window.GITHUB_CLIENT_ID = "${process.env.GITHUB_CLIENT_ID}"
        </script>
        <script src="https://unpkg.com/babel-standalone@6.24.0/babel.min.js"></script>
        <script src="/assets/main.bundle.js"></script>
      </body>
    </html>
  `
})

app.use(bodyParser())
app.use(router.routes())
app.listen(4200)
