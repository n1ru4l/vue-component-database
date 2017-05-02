<template>
  <div class="main-component">
    <md-toolbar>
      <md-button class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">
        Vue Component Database
      </h2>
      <md-button class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>
    </md-toolbar>
    <div class="site-container">
      <component-list
        :isLoading="isLoadingComponents"
        :components="components"
        :onAdderClicked="onAdderClicked"
        :onDeleteListItemClicked="onDeleteComponent"
      >
      </component-list>
      <component-container
        :componentId="$route.params.id"
      >
      </component-container>
    </div>
    <component-adder
      :show="isAddingNewComponent"
      :onCancel="onAdderCancel"
      :onCreate="onAdderCreate"
    >
    </component-adder>
  </div>
</template>
<script>
  import Vue from 'vue'
  import gql from 'graphql-tag'
  import ComponentList from './ComponentList.vue'
  import ComponentContainer from './ComponentContainer.vue'
  import ComponentAdder from './ComponentAdder.vue'
  const httpVueLoader = require('../../../http-vue-loader')

  const QUERY_ALL_COMPONENTS = gql`
    query allComponents {
      components {
       id,
       title,
       description,
       component
     }
   }
  `

  const MUTATION_CREATE_COMPONENT = gql`
    mutation createComponent($componentData: ComponentInput!) {
      createComponent(component: $componentData) {
        id
        title
        description
        component
      }
    }
  `

  const MUTATION_DELETE_COMPONENT = gql`
    mutation deleteComponent($componentId: String!) {
      deleteComponent(componentId: $componentId)
    }
  `


  export default {
    components: {
      ComponentList,
      ComponentContainer,
      ComponentAdder,
    },
    apollo: {
      components() {
        return {
          query: QUERY_ALL_COMPONENTS,
          loadingKey: `isLoadingComponents`,
        }
      }
    },
    data() {
      return {
        target: `World`,
        hasComponent: false,
        componentName: `sum-component-1`,
        isAddingNewComponent: false,
        components: [],
      }
    },
    methods: {
      loadAsyncComponent() {
          httpVueLoader(`/components/test-component.vue`)((component) => {
              Vue.component(`sum-component-1`, component)
              this.hasComponent = true
          })
      },
      onAdderClicked() {
        this.isAddingNewComponent = true
      },
      onAdderCancel() {
        this.isAddingNewComponent = false
      },
      onAdderCreate(newComponentData) {
        this.$apollo.mutate({
          mutation: MUTATION_CREATE_COMPONENT,
          variables: {
            componentData: newComponentData,
          },
          updateQueries: {
            allComponents: (prevResult, { mutationResult }) => {
              return {
                components: [...prevResult.components, mutationResult.data.createComponent]
              }
            }
          }
        }).then(() => {
          this.isAddingNewComponent = false
        })
      },
      onDeleteComponent(componentId, ev) {
        ev.preventDefault();
        this.$router.push(`/`)
        this.$apollo.mutate({
          mutation: MUTATION_DELETE_COMPONENT,
          variables: {
            componentId,
          },
          updateQueries: {
            allComponents: (prevResult, { mutationResult }) => {
              const deletedComponentId = mutationResult.data.deleteComponent
              console.log(`deletedComponentId`, deletedComponentId)
              return {
                components: prevResult.components.filter(component => component.id !== deletedComponentId)
              }
            }
          },
        })
      }
    }
  }
</script>
<style scoped>
  .main-component {
    height: 100vh;
  }
  .main-component > md-toolbar {
    height: 76px;
  }
  .main-component > .site-container {
    height: calc(100vh - 64px);
    overflow: hidden;
    display: flex;
  }
  h1 {
    color: red;
  }
</style>
