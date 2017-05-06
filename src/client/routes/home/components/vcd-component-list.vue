<template>
  <md-list
    class="vcd-component-list"
  >
    <template v-if="isLoading">
      Loading...
    </template>
    <template v-else>
      <vcd-component-list-item
        v-for="component in components"
        :key="component.id"
        :name="component.title"
        :description="component.description"
        :authorLogin="component.author.login"
        :id="component.id"
        :onDeleteClicked="onDeleteListItemClicked"
      >
      </vcd-component-list-item>
    </template>
  </md-list>
</template>
<script>
  import vcdComponentListItem from './vcd-component-list-item.vue'

  export default {
    components: {
      vcdComponentListItem,
    },
    props: {
      onDeleteListItemClicked: {
        type: Function,
        required: true,
      },
      components: {
        type: Array,
        required: true,
        default: [],
      },
      isLoading: {
        type: Number,
        required: true,
      },
    },
  }
</script>
<style scoped>
  .vcd-component-list {
    border-right: 1px solid rgba(0,0,0,.12);
    padding-bottom: 0;
    overflow-y: scroll;
  }
</style>
