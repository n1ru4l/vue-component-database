import Vue from 'vue'

import { ApolloClient, createBatchingNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'

import Authenticator from './services/authenticator'

const networkInterface = createBatchingNetworkInterface({
  uri: `/graphql`,
  batchInterval: 10,
})

networkInterface.use([
  {
    applyBatchMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      let accessToken = Authenticator.getToken()
      if (accessToken) {
        req.options.headers['authorization'] = `Bearer ${accessToken}`
      }
      next()
    }
  }
])

// Create the apollo client
const apolloClient = new ApolloClient({
  networkInterface,
  connectToDevTools: true,
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})


export default apolloProvider
