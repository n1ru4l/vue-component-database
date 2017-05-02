import Vue from 'vue'

import { ApolloClient, createNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'

// Create the apollo client
const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `/graphql`,
    transportBatching: true,
  }),
  connectToDevTools: true,
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})


export default apolloProvider
