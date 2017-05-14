<template>
  <mu-list-item
    :to="attrHref"
    :describeText="description"
  >
    <mu-icon slot="left" value="inbox"/>
    <span slot="title">{{authorLogin}} / <b>{{name}}</b></span>
  </mu-list-item>
</template>
<script>
  import muListItem from 'muse-ui/src/list/listItem.vue'
  import muIcon from 'muse-ui/src/icon/icon.vue'
  import muIconButton from 'muse-ui/src/iconButton/iconButton.vue'

  export default {
    components: {
      muIconButton,
      muListItem,
      muIcon,
    },
    props: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      authorLogin: {
        type: String,
        required: true,
      },
    },
    computed: {
      attrHref() {
        return `/${this.id}`
      },
    },
  }
</script>
<style>
  .router-link-active .mu-item-title-row {
    color: #7e57c2;
  }
</style>
