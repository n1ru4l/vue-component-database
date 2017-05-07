<template>
  <mu-list-item
    :to="attrHref"
  >
    <mu-icon slot="left" value="inbox"/>
    <span slot="title">{{authorLogin}} / <b>{{name}}</b></span>
    <span slot="describe">{{ description }}</span>
    <mu-icon-button
      slot="right"
      icon="delete"
      v-on:click.native="onDeleteClicked(id, $event)"
    />
  </mu-list-item>
</template>
<script>
  import { listItem as muListItem } from 'muse-ui/src/list'
  import muIcon from 'muse-ui/src/icon'
  import muIconButton from 'muse-ui/src/iconButton'

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
      onDeleteClicked: {
        type: Function,
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
