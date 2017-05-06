<template>
  <div class="main-component">
    <vcd-header
      :user="currentUser"
      :isLoadingUser="isLoadingUser"
    >
    </vcd-header>
    <div class="site-container">
      <vcd-component-list
        :isLoading="isLoadingComponents"
        :components="components"
        :onAdderClicked="onAdderClicked"
        :onDeleteListItemClicked="onDeleteComponent"
      >
      </vcd-component-list>
      <vcd-component-container
        :componentId="$route.params.id"
      >
      </vcd-component-container>
    </div>
    <vcd-component-adder
      :show="isAddingNewComponent"
      :onCancel="onAdderCancel"
      :onCreate="onAdderCreate"
    >
    </vcd-component-adder>
  </div>
</template>
<script>
  import Vue from 'vue'
  import gql from 'graphql-tag'
  import vcdHeader from './vcd-header.vue'
  import vcdComponentList from './vcd-component-list.vue'
  import vcdComponentContainer from './vcd-component-container.vue'
  import vcdComponentAdder from './vcd-component-adder.vue'
  import httpVueLoader from '../../../http-vue-loader'

  const QUERY_USER_DATA = gql`
    query currentUser {
      currentUser {
        id
        login
        avatarUrl
      }
    }
  `


  const QUERY_ALL_COMPONENTS = gql`
    query allComponents {
      components {
       id
       title
       description
       component
       author {
         id
         login
       }
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
        author {
          id
          name
        }
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
      vcdHeader,
      vcdComponentList,
      vcdComponentAdder,
      vcdComponentContainer,
    },
    apollo: {
      components() {
        return {
          query: QUERY_ALL_COMPONENTS,
          loadingKey: `isLoadingComponents`,
        }
      },
      currentUser() {
        return {
          query: QUERY_USER_DATA,
          loadingKey: `isLoadingUser`,
        }
      },
    },
    data() {
      return {
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
            allComponents: (prevResult, { mutationResult }) => ({
              components: [ ...prevResult.components, mutationResult.data.createComponent ],
            }),
          },
        }).then(() => {
          this.isAddingNewComponent = false
        })
      },
      onDeleteComponent(componentId, ev) {
        ev.preventDefault()
        this.$router.push(`/`)
        this.$apollo.mutate({
          mutation: MUTATION_DELETE_COMPONENT,
          variables: {
            componentId,
          },
          updateQueries: {
            allComponents: (prevResult, { mutationResult }) => {
              const deletedComponentId = mutationResult.data.deleteComponent
              const componentFilter = component => component.id !== deletedComponentId
              return {
                components: prevResult.components.filter(componentFilter),
              }
            },
          },
        })
      },
    },
  }
</script>
<style scoped>
  .main-component {
    height: 100vh;
  }

  .main-component > .site-container {
    height: calc(100vh - 64px);
    overflow: hidden;
    display: flex;
  }
</style>
