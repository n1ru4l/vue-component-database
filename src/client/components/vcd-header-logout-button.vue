<template>
  <mu-icon-button
    @click.native="onClick"
    icon="exit_to_app"
  />
</template>
<script>
  import muIconButton from 'muse-ui/src/iconButton'
  import Authenticator from '../services/authenticator'

  export default {
    components: {
      muIconButton,
    },
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
