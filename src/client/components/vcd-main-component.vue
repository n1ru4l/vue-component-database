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
  import Settings, { SETTING_IS_SIDEBAR_ACTIVE } from 'services/settings'
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
      isSidebarActive: Settings.getBoolean(SETTING_IS_SIDEBAR_ACTIVE, false),
    }),
    methods: {
      toggleIsSidebarActive() {
        this.isSidebarActive = !this.isSidebarActive
        Settings.setBoolean(SETTING_IS_SIDEBAR_ACTIVE, this.isSidebarActive)
      },
    },
  }
</script>
<style>
</style>
