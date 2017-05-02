<template>
  <md-list
    class="component-list"
  >
    <template v-if="isLoading">
      Loading...
    </template>
    <template v-else>
      <component-list-item
        v-for="component in components"
        :key="component.id"
        :name="component.title"
        :description="component.description"
        :id="component.id"
        :onDeleteClicked="onDeleteListItemClicked"
      >
      </component-list-item>
    </template>
    <md-button
      class="component-list__adder md-icon-button md-raised md-dense"
      id="component-adder-button"
      v-on:click.native="onAdderClicked"
    >
      <md-icon>add</md-icon>
    </md-button>
  </md-list>
</template>
<script>
  import ComponentListItem from './ComponentListItem.vue';

  export default {
    components: {
      ComponentListItem,
    },
    props: {
      onAdderClicked: {
        type: Function,
        required: true,
      },
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
      }
    },
  }
</script>
<style scoped>
  .component-list {
    width: 30%;
    border-right: 1px solid rgba(0,0,0,.12);
    position: relative;
    padding-bottom: 0;
  }

  .component-list__adder {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 10px;
    margin-right: 10px;
  }
</style>
