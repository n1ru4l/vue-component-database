'use strict'

require(`dotenv`).config()

const Koa = require(`koa`)
const app = new Koa()
const createKoaRouter = require(`koa-router`)
const router = createKoaRouter()
const koaSend = require(`koa-send`)
const bodyParser = require(`koa-bodyparser`)
const { graphql, graphiql } = require(`./api`)

router.get(/^\/assets(?:\/|$)/, async (ctx) => {
  const assetPath = ctx.path.replace(/assets\//, ``)
  await koaSend(ctx, assetPath, {
    root: `${__dirname}/../../build`,
  })
})

// router.get(/^\/components(?:\/|$)/, async (ctx) => {
//     const assetPath = ctx.path.replace(/components\//, ``)
//     await koaSend(ctx, assetPath, {
//         root: `${__dirname}/../../components`,
//     })
// })

router.post(`/graphql`, graphql)
router.get(`/graphiql`, graphiql)

router.get(/(?:\/|$)/, async (ctx) => {
  //language=HTML
  ctx.body = `
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
        <script src="https://unpkg.com/babel-standalone@6.24.0/babel.min.js"></script>
        <script src="/assets/main.bundle.js"></script>
      </body>
    </html>
  `
})

app.use(bodyParser())
app.use(router.routes())
app.listen(4200)
