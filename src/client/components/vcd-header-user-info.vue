<template>
  <div class="vcd-header-user-info">
    <span>Logged in as {{login}}</span>
    <mu-avatar
      :src="avatarUrl"
    />
  </div>
</template>
<script>
  import muAvatar from 'muse-ui/src/avatar/avatar.vue'

  export default {
    components: {
      muAvatar,
    },
    props: {
      login: {
        type: String,
        required: true,
      },
      avatarUrl: {
        type: String,
        required: true,
      },
    },
  }
</script>
<style scoped>
  .vcd-header-user-info {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  span {
    padding-right: 10px;
  }

  .mu-avatar {
    width: 25px;
    min-width: 25px;
    height: 25px;
    min-height: 25px;
  }
</style>
