<template>
  <div class="component-container">
    <div v-if="!componentId">
      Please select a component.
    </div>
    <div v-else-if="isComponentLoading">
      Loading component...
    </div>
    <div v-else-if="isGeneratingComponent">
      Generating component...
    </div>
    <div v-else-if="componentTagName">
      <component :is="componentTagName"></component>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import gql from 'graphql-tag'
  import httpVueLoader from '../../../http-vue-loader'
  const QUERY_ONE_COMPONENT_BY_ID =  gql`
    query OneComponentById($componentId: String!) {
      component(id: $componentId) {
        id
        component
      }
    }
  `

  const COMPONENT_PREFIX = `custom-component-`
  let componentCache = new Map

  export default {
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
            let componentName = `${COMPONENT_PREFIX}-${this.component.id}`
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
  }
</style>
