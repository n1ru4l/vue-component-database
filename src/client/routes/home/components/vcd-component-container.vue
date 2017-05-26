<template>
  <div class="vcd-component-container">
    <template v-if="isComponentLoading">
      <div class="vcd-component-container__message">Loading component...</div>
    </template>
    <template v-else>
      <div class="vcd-component-container__upper">
        <vcd-code-editor
          :code="component.component"
          :isVisible="isCodeEditorVisible"
          :updateCodePreview="onCodeChanged"
          :currentUserId="currentUserId"
          :componentAuthorId="componentAuthorId"
          :componentId="componentId"
        />
        <vcd-component-viewer
          ref="componentViewer"
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
        :title="component.title"
        :description="component.description"
      />
    </template>
  </div>
</template>
<script>
  import QUERY_ONE_COMPONENT_BY_ID from 'graphql-docs/queries/one-component-by-id.graphql'
  import Settings, {
    SETTING_IS_EDITOR_VISIBLE,
  } from '../../../services/settings'

  import { stripIndent } from 'common-tags'

  import muIconButton from 'muse-ui/src/iconButton/iconButton.vue'
  import vcdCodeEditor from './vcd-code-editor.vue'
  import vcdComponentToolbar from './vcd-component-toolbar.vue'
  import vcdComponentViewer from './vcd-component-viewer.vue'

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
      currentUserId: {
        type: String,
        required: false,
      },
    },
    data: () => ({
      isComponentLoading: false,
      componentTagName: null,
      isGeneratingComponent: false,
      isCodeEditorVisible: Settings.getBoolean(SETTING_IS_EDITOR_VISIBLE, true),
      componentOptions: {},
      component: {
        component: stripIndent`
          <temp${``}late>
            <h2>Hello World</h2>
          </temp${``}late>
          <scr${``}ipt>
            // Vue Component Editor
            export default {
              data: () => ({}),
            }
          </scr${``}ipt>
          <sty${``}le>
            h2 {
              color: red;
            }
          </sty${``}le>
        `,
        title: `new-component`,
        description: `Some component description`,
      },
      code: ``,
    }),
    computed: {
      hasComponent() {
        return !!this.component
      },
      componentAuthorId() {
        return this.component && this.component.author && this.component.author.id
      },
    },
    // lifecycle
    updated() {
      this.onCodeChanged(this.component.component)
    },
    methods: {
      toggleCodeEditorVisibility() {
        this.isCodeEditorVisible = !this.isCodeEditorVisible
        Settings.setBoolean(SETTING_IS_EDITOR_VISIBLE, this.isCodeEditorVisible)
      },
      onCodeChanged(code) {
        this.code = code
        const { componentViewer } = this.$refs
        if (!componentViewer) return
        componentViewer.updateIframe(code)
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
