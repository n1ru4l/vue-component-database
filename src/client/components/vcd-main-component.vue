<template>
  <div class="main-component">
    <vcd-header
      :user="currentUser"
      :isLoadingUser="isLoadingUser"
      :onMenuIconClicked="toggleIsSidebarActive"
    >
    </vcd-header>
    <router-view
      :currentUser="currentUser"
      :isSidebarActive="isSidebarActive"
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
      isSidebarActive: true,
    }),
    methods: {
      toggleIsSidebarActive() {
        this.isSidebarActive = !this.isSidebarActive
      },
    },
  }
</script>
<style>
</style>
