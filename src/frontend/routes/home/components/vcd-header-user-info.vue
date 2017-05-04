<template>
  <md-button
    class="md-default"
  >
    <span>
      {{login}}
    </span>
    <md-avatar>
      <img
        :src="avatarUrl"
        alt="Avatar"
      >
    </md-avatar>
  </md-button>
</template>
<script>
  export default {
    props: {
      login: {
        type: String,
        required: true,
      },
      avatarUrl: {
        type: String,
        required: true,
      }
    }
  }
</script>
<style scoped>
  .md-button {
    display: flex;
    align-items: center;
    color: #fff;
  }

  .md-button > span {
    padding-right: 10px;
  }

  .md-avatar {
    width: 25px;
    min-width: 25px;
    height: 25px;
    min-height: 25px;
  }
</style>
