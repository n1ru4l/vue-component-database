<template>
  <md-toolbar>
    <md-button class="md-icon-button">
      <md-icon>menu</md-icon>
    </md-button>

    <h2 class="md-title" style="flex: 1">
      Vue Component Database
    </h2>

    <template v-if="isLoadingUser">
      LOADING...
    </template>
    <template v-else-if="user">
      <vcd-header-user-info
        :login="user.login"
        :avatarUrl="user.avatarUrl"
      >
      </vcd-header-user-info>
      <vcd-header-logout-button>
      </vcd-header-logout-button>
    </template>
    <template v-else="">
      <vcd-header-login-button>
      </vcd-header-login-button>
    </template>
  </md-toolbar>
</template>
<script>
  import vcdHeaderLoginButton from './vcd-header-login-button.vue'
  import vcdHeaderUserInfo from './vcd-header-user-info.vue'
  import vcdHeaderLogoutButton from './vcd-header-logout-button.vue'

  export default {
    components: {
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