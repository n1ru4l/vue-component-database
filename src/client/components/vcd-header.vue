<template>
  <mu-app-bar
    title="Vue Component Database"
  >
    <template v-if="isLoadingUser">
      LOADING...
    </template>
    <template v-else-if="user">
      <vcd-header-user-info
        :login="user.login"
        :avatarUrl="user.avatarUrl"
        slot="right"
      />
      <vcd-header-logout-button
        slot="right"
      />
    </template>
    <template v-else="">
      <vcd-header-login-button
        slot="right"
      />
    </template>
  </mu-app-bar>
</template>
<script>
  import muAppBar from 'muse-ui/src/appBar'

  import vcdHeaderLoginButton from './vcd-header-login-button.vue'
  import vcdHeaderUserInfo from './vcd-header-user-info.vue'
  import vcdHeaderLogoutButton from './vcd-header-logout-button.vue'

  export default {
    components: {
      muAppBar,
      vcdHeaderLoginButton,
      vcdHeaderUserInfo,
      vcdHeaderLogoutButton,
    },
    props: {
      user: {
        type: Object,
        required: false,
      },
      isLoadingUser: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  }
</script>
<style scoped>
  md-toolbar {
    height: 76px;
  }
</style>
