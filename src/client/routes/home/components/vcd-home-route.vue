<template>
  <div class="site-container">
    <div
      class="site-container__side"
      v-bind:class="{ 'site-container__side--show': isSidebarActive }"
    >
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
      :currentUserId="currentUserId"
    />
    <template v-if="currentUser">
      <vcd-component-adder
        :show="isAddingNewComponent"
        :onCancel="onAdderCancel"
        :onCreate="onAdderCreate"
      />
    </template>
  </div>
</template>
<script>
  import QUERY_ALL_COMPONENTS from 'graphql-docs/queries/all-components.graphql'
  import MUTATION_CREATE_COMPONENT from 'graphql-docs/mutations/create-component.graphql'
  import MUTATION_DELETE_COMPONENT from 'graphql-docs/mutations/delete-component.graphql'

  import muFloatButton from 'muse-ui/src/floatButton'
  import vcdHeader from '../../../components/vcd-header.vue'
  import vcdComponentList from './vcd-component-list.vue'
  import vcdComponentContainer from './vcd-component-container.vue'
  import vcdComponentAdder from './vcd-component-adder.vue'

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
      isSidebarActive: {
        type: Boolean,
        required: true,
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
    computed: {
      currentUserId() {
        return this.currentUser && this.currentUser.id
      },
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
    display: flex;
    flex-flow: column;
    height: 100vh;
  }

  .site-container {
    height: calc(100vh - 64px);
    overflow: hidden;
    display: flex;
    position: relative;
  }

  .site-container__side {
    width: 0%;
    overflow: hidden;
    display: flex;
    position: relative;
    transition: width .3s ease;
  }

  .site-container__side--show {
    width: 400px;
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
