<template>
  <mu-app-bar
    title="Vue Component Database"
  >
    <mu-icon-button
      icon="menu"
      slot="left"
      v-on:click="onMenuIconClicked"
    />
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
  import muAppBar from 'muse-ui/src/appBar/appBar.vue'
  import muIconButton from 'muse-ui/src/iconButton/iconButton.vue'

  import vcdHeaderLoginButton from './vcd-header-login-button.vue'
  import vcdHeaderUserInfo from './vcd-header-user-info.vue'
  import vcdHeaderLogoutButton from './vcd-header-logout-button.vue'

  export default {
    components: {
      muAppBar,
      muIconButton,
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
      onMenuIconClicked: {
        type: Function,
        required: true,
      },
    },
  }
</script>
<style scoped>
</style>
