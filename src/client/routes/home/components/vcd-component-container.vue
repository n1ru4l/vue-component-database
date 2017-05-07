<template>
  <div class="vcd-component-container">
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
      <div class="vcd-component-container__upper">
          <vcd-code-editor
            :code="component.component"
            :isVisible="isCodeEditorVisible"
          />
        <div class="vcd-component-container__render-section">
          <div class="vcd-icon-bar">
            <mu-icon-button
              class="vcd-edit-button"
              icon="mode_edit"
              v-on:click="toggleCodeEditorVisibility"
            />
          </div>
          <component :is="componentTagName"></component>
        </div>
      </div>
      <vcd-component-toolbar
        :component="component"
      />
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import gql from 'graphql-tag'
  import muIconButton from 'muse-ui/src/iconButton'
  import httpVueLoader from '../../../http-vue-loader'

  import vcdCodeEditor from './vcd-code-editor.vue'
  import vcdComponentToolbar from './vcd-component-toolbar.vue'

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

  const COMPONENT_PREFIX = `custom-component-`
  const componentCache = new Map() // @TODO: Poor man strikes again

  export default {
    components: {
      muIconButton,
      vcdCodeEditor,
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
          result() {
            const componentName = `${COMPONENT_PREFIX}-${this.componentId}`
            if (componentCache.get(componentName)) {
              this.componentTagName = componentName
              return
            }
            this.isGeneratingComponent = true
            httpVueLoader.fromText(this.component.component).then((objComponent) => {
              Vue.component(componentName, objComponent)
              componentCache.set(this.component.id, true)
              this.isGeneratingComponent = false
              this.componentTagName = componentName
            })
          },
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
    }),
    computed: {
      hasComponent() {
        return !!this.component
      },
    },
    methods: {
      toggleCodeEditorVisibility() {
        this.isCodeEditorVisible = !this.isCodeEditorVisible;
      },
    },
  }
</script>
<style>
  .vcd-component-container {
    flex-grow: 1;
    display: flex;
    flex-flow: column;
  }

  .vcd-component-container__upper {
    display: flex;
    flex-grow: 1;
  }

  .vcd-component-container__upper > * {
    flex-basis: 50%;
  }

  .vcd-component-container__render-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }

  .vcd-icon-bar {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
