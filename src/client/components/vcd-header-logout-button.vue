<template>
  <md-button
    class="md-icon-button"
    @click.native="onClick"
  >
    <md-icon>
        exit_to_app
    </md-icon>
  </md-button>
</template>
<script>
  import Authenticator from '../services/authenticator'

  export default {
    methods: {
      onClick() {
        Authenticator.setToken(``)
        this.$apollo.provider.defaultClient.resetStore()
      },
    },
  }
</script>
<style scoped>
</style>