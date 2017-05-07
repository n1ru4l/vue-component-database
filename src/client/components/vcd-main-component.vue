<template>
  <div class="main-component">
    <vcd-header
      :user="currentUser"
      :isLoadingUser="isLoadingUser"
    >
    </vcd-header>
    <router-view
      :currentUser="currentUser"
    >
    </router-view>
  </div>
</template>
<script>
  import gql from 'graphql-tag'
  import vcdHeader from './vcd-header.vue'

  const QUERY_USER_DATA = gql`
    query currentUser {
      currentUser {
        id
        login
        avatarUrl
      }
    }
  `

  export default {
    components: {
      vcdHeader,
    },
    apollo: {
      currentUser() {
        return {
          query: QUERY_USER_DATA,
          loadingKey: `isLoadingUser`,
        }
      },
    },
    data: () => ({
      isUserLoading: 0,
      currentUser: null,
    }),
  }
</script>
<style>
</style>
