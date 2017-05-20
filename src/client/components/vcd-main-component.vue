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
  import QUERY_USER_DATA from 'graphql-docs/queries/current-user.graphql'
  import vcdHeader from './vcd-header.vue'

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
      isLoadingUser: 0,
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
