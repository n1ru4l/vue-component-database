<template>
  <div class="vcd-component-container">
    <template v-if="!componentId">
      <div class="vcd-component-container__message">Please select a component.</div>
    </template>
    <template v-else-if="isComponentLoading">
      <div class="vcd-component-container__message">Loading component...</div>
    </template>
    <template v-else>
      <div class="vcd-component-container__upper">
        <vcd-code-editor
          :code="component.component"
          :isVisible="isCodeEditorVisible"
          :onCodeChanged="onCodeChanged"
        />
        <vcd-component-viewer
          :code="code"
        >
          <div
            class="vcd-icon-bar"
            slot="buttons"
          >
            <mu-icon-button
              class="vcd-edit-button"
              icon="mode_edit"
              v-on:click="toggleCodeEditorVisibility"
            />
          </div>
        </vcd-component-viewer>
      </div>
      <vcd-component-toolbar
        :component="component"
      />
    </template>
  </div>
</template>
<script>
  import gql from 'graphql-tag'
  import muIconButton from 'muse-ui/src/iconButton'

  import vcdCodeEditor from './vcd-code-editor.vue'
  import vcdComponentToolbar from './vcd-component-toolbar.vue'
  import vcdComponentViewer from './vcd-component-viewer.vue'

  const QUERY_ONE_COMPONENT_BY_ID = gql`
    query OneComponentById($componentId: String!) {
      component(id: $componentId) {
        id
        title
        description
        component
      }
    }
  `

  export default {
    components: {
      muIconButton,
      vcdCodeEditor,
      vcdComponentViewer,
      vcdComponentToolbar,
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
        }
      },
    },
    props: {
      componentId: {
        type: String,
        required: false,
      },
    },
    data: () => ({
      isComponentLoading: false,
      componentTagName: null,
      isGeneratingComponent: false,
      isCodeEditorVisible: false,
      componentOptions: {},
      code: ``,
    }),
    computed: {
      hasComponent() {
        return !!this.component
      },
    },
    methods: {
      toggleCodeEditorVisibility() {
        this.isCodeEditorVisible = !this.isCodeEditorVisible
      },
      onCodeChanged(code) {
        this.code = code
      },
    },
  }
</script>
<style>
  .vcd-component-container {
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .vcd-component-container__message {
    align-self: center;
    font-weight: 700;
  }

  .vcd-component-container__upper {
    display: flex;
    flex-grow: 1;
  }

  .vcd-component-container__upper > * {
    flex-basis: 50%;
  }

  .vcd-icon-bar {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
