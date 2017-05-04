<template>
  <div class="component-container">
    <template v-if="!componentId">
      Please select a component.
    </template>
    <template v-else-if="isComponentLoading">
      Loading component...
    </template>
    <template v-else-if="isGeneratingComponent">
      Generating component...
    </template>
    <template v-else-if="componentTagName">
      <div class="component-container__render-section">
        <component :is="componentTagName"></component>
      </div>
      <component-toolbar
        :component="component"
      >
      </component-toolbar>
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import gql from 'graphql-tag'
  import httpVueLoader from '../../../http-vue-loader'

  import ComponentToolbar from './ComponentToolbar.vue'

  const QUERY_ONE_COMPONENT_BY_ID =  gql`
    query OneComponentById($componentId: String!) {
      component(id: $componentId) {
        id
        title
        description
        component
      }
    }
  `

  const COMPONENT_PREFIX = `custom-component-`
  let componentCache = new Map

  export default {
    components: {
      ComponentToolbar,
    },
    apollo: {
      component() {
        return {
          query: QUERY_ONE_COMPONENT_BY_ID,
          variables() {
            return {
              componentId: this.componentId,
            }
          },
          skip() {
            return !this.componentId
          },
          loadingKey: `isComponentLoading`,
          result() {
            let componentName = `${COMPONENT_PREFIX}-${this.componentId}`
            if (componentCache.get(componentName)) {
              this.componentTagName = componentName
              return
            }
            this.isGeneratingComponent = true
            httpVueLoader.fromText(this.component.component).then(objComponent => {
              Vue.component(componentName, objComponent)
              componentCache.set(this.component.id, true)
              this.isGeneratingComponent = false
              this.componentTagName = componentName
            })
          }
        }
      }
    },
    props: {
      componentId: {
        type: String,
        required: false,
      }
    },
    data: () => ({
      isComponentLoading: false,
      componentTagName: null,
      isGeneratingComponent: false,
    }),
    computed: {
      hasComponent() {
        return !!this.component
      },
    },
  }
</script>
<style>
  .component-container {
    width: 70%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-flow: column;
  }
  .component-container__render-section {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
</style>
