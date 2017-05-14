<template>
  <div class="site-container">
    <div
      class="site-container__side"
      v-bind:class="{ 'site-container__side--show': isSidebarActive }"
    >
      <vcd-component-list
        :isLoading="isLoadingComponents"
        :components="components"
      >
      </vcd-component-list>
      <vcd-speed-dial
        icon="add"
        iconActive="close"
        direction="left"
        class="component-adder-button"
        secondary
        mini
      >
        <mu-float-button
          icon="insert_drive_file"
          mini
          v-on:click="onButtonCreateNewClicked"
        />
        <mu-float-button
          icon="file_upload"
          mini
          v-on:click="onButtonUploadClicked"
        />
      </vcd-speed-dial>
    </div>

    <vcd-component-container
      :componentId="$route.params.id"
      :currentUserId="currentUserId"
    />
    <template v-if="currentUser">
      <vcd-component-adder
        :show="isAddingNewComponent"
        :isUploadMode="isUploadMode"
        :onCancel="hideComponentAdder"
        :onCreate="onAdderCreate"
      />
    </template>
  </div>
</template>
<script>
  import QUERY_ALL_COMPONENTS from 'graphql-docs/queries/all-components.graphql'
  import MUTATION_CREATE_COMPONENT from 'graphql-docs/mutations/create-component.graphql'

  import muFloatButton from 'muse-ui/src/floatButton/floatButton.vue'
  import vcdHeader from '../../../components/vcd-header.vue'
  import vcdComponentList from './vcd-component-list.vue'
  import vcdComponentContainer from './vcd-component-container.vue'
  import vcdComponentAdder from './vcd-component-adder.vue'
  import vcdSpeedDial from 'components/vcd-speed-dial.vue'

  export default {
    components: {
      muFloatButton,
      vcdHeader,
      vcdComponentList,
      vcdComponentAdder,
      vcdComponentContainer,
      vcdSpeedDial,
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
        isUploadMode: false,
      }
    },
    computed: {
      currentUserId() {
        return this.currentUser && this.currentUser.id
      },
    },
    methods: {
      showComponentAdder() {
        this.isAddingNewComponent = true
      },
      hideComponentAdder() {
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
      onButtonUploadClicked() {
        this.isUploadMode = true
        this.showComponentAdder()
      },
      onButtonCreateNewClicked() {
        this.isUploadMode = false
        this.showComponentAdder()
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
