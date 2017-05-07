<template>
  <div class="site-container">
    <div class="site-container__side">
      <vcd-component-list
        :isLoading="isLoadingComponents"
        :components="components"
        :onAdderClicked="onAdderClicked"
        :onDeleteListItemClicked="onDeleteComponent"
      >
      </vcd-component-list>
      <mu-float-button
        icon="add"
        secondary
        mini
        class="component-adder-button"
        v-on:click.native="onAdderClicked"
      />
    </div>

    <vcd-component-container
      :componentId="$route.params.id"
    >
    </vcd-component-container>
    <template v-if="currentUser">
      <vcd-component-adder
        :show="isAddingNewComponent"
        :onCancel="onAdderCancel"
        :onCreate="onAdderCreate"
      >
      </vcd-component-adder>
    </template>
  </div>
</template>
<script>
  import gql from 'graphql-tag'
  import muFloatButton from 'muse-ui/src/floatButton'

  import vcdHeader from '../../../components/vcd-header.vue'
  import vcdComponentList from './vcd-component-list.vue'
  import vcdComponentContainer from './vcd-component-container.vue'
  import vcdComponentAdder from './vcd-component-adder.vue'

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
          login
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
      muFloatButton,
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
    },
    props: {
      currentUser: {
        type: Object,
        required: false,
      },
    },
    data() {
      return {
        isAddingNewComponent: false,
        isLoadingComponents: 0,
        isLoadingUser: 0,
        components: [],
      }
    },
    methods: {
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

  .site-container__side {
    width: 30%;
    display: flex;
    position: relative;
  }

  .component-adder-button {
    position: absolute;
    z-index: 50;
    bottom: 0;
    right: 0;
    margin-bottom: 10px;
    margin-right: 10px;
  }
</style>
