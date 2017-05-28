<template>
  <div
    class="vcd-code-editor"
    v-bind:class="{ 'vcd-code-editor--show': isVisible }"
  >
    <div class="vcd-code-editor__buttons">
      <vcd-code-editor-settings
        :isAutoUpdateEnabled="isAutoUpdateEnabled"
        :onAutoUpdateChanged="onAutoUpdateChanged"
        :isAutoSaveEnabled="isAutoSaveEnabled"
        :onAutoSaveChanged="onAutoSaveChanged"
        :isAutoSaveDisabled="isAutoSaveDisabled"
        :onDeleteComponentClicked="showConfirmDeleteComponent"
        :isDeleteEnabled="isCurrentUserTheComponentAuthor"
      />
      <mu-icon-button
        icon="refresh"
        v-on:click="onRefreshButtonClicked"
      />
      <mu-icon-button
        icon="save"
        :disabled="isSaveDisabled"
        v-on:click="saveComponent"
      />
    </div>
    <cm-code-mirror
      class="vcd-code-editor"
      :options="editorOptions"
      :value="code"
      v-on:input="onCodeMirrorChange"
      ref="leEditor"
    />
    <mu-toast
      v-if="showSavingToast"
      :message="toastMessage"
    />
    <mu-dialog
      title="Delete component"
      :open="showDeleteComponentDialog"
      v-on:close="hideConfirmDeleteComponent"
    >
      By confirming this dialog the component will be permanently deleted.
      <mu-flat-button
        slot="actions"
        label="Confirm Delete"
        v-on:click="deleteComponent"
        labelPosition="before"
        icon="delete_forever"
      />
      <mu-flat-button
        slot="actions"
        label="Abort"
        primary
        v-on:click="hideConfirmDeleteComponent"
      />
    </mu-dialog>
  </div>
</template>
<script>
  import MUTATION_UPDATE_COMPONENT_CONTENTS from 'graphql-docs/mutations/update-component-contents.graphql'
  import MUTATION_DELETE_COMPONENT from 'graphql-docs/mutations/delete-component.graphql'
  import 'codemirror/mode/vue/vue'
  import Settings, {
    SETTING_IS_AUTO_UPDATE_ENABLED,
    SETTING_IS_AUTO_SAVE_ENABLED,
  } from 'services/settings'
  import { debounce } from 'lodash'

  import cmCodeMirror from 'vue-codemirror-lite/codemirror.vue'
  import muIconButton from 'muse-ui/src/iconButton/iconButton.vue'
  import vcdCodeEditorSettings from './vcd-code-editor-settings.vue'
  import muToast from 'muse-ui/src/toast/toast.vue'
  import muDialog from 'muse-ui/src/dialog/dialog.vue'
  import muFlatButton from 'muse-ui/src/flatButton/flatButton.vue'

  export default {
    components: {
      cmCodeMirror,
      vcdCodeEditorSettings,
      muIconButton,
      muToast,
      muDialog,
      muFlatButton,
    },
    props: {
      updateCodePreview: {
        type: Function,
        required: true,
      },
      code: {
        type: String,
        required: false,
        default: ``,
      },
      isVisible: {
        type: Boolean,
        required: true,
      },
      currentUserId: {
        type: String,
        required: false,
      },
      componentAuthorId: {
        type: String,
        required: false,
      },
      componentId: {
        type: String,
        required: false,
      },
    },
    data() {
      const onSave = () => {
        this.updateCodePreview(this.currentCode)
        return false
      }

      return {
        editorOptions: {
          tabSize: 2,
          mode: `text/x-vue`,
          lineNumbers: true,
          line: true,
          styleSelectedText: true,
          extraKeys: {
            [`Ctrl-S`]: onSave,
            [`Cmd-S`]: onSave,
          },
        },
        currentCode: ``,
        isAutoUpdateEnabled: Settings.getBoolean(SETTING_IS_AUTO_UPDATE_ENABLED, true),
        isAutoSaveEnabled: Settings.getBoolean(SETTING_IS_AUTO_SAVE_ENABLED, false),
        showSavingToast: false,
        toastMessage: `Saving component...`,
        toastTimeout: null,
        showDeleteComponentDialog: false,
      }
    },
    // computed
    computed: {
      isSaveDisabled() {
        return this.code === this.currentCode || !this.componentId
      },
      isCurrentUserTheComponentAuthor() {
        return this.currentUserId === this.componentAuthorId
      },
      isAutoSaveDisabled() {
        return !this.isCurrentUserTheComponentAuthor
      }
    },
    // lifecycle
    created() {
      this.currentCode = this.code
      this.debounceUpdateCodePreview = debounce((code) => {
        this.updateCodePreview(code)
      }, 500)
      this.debounceSaveComponent = debounce(() => {
        this.saveComponent()
      }, 1000)
    },
    mounted() {
      this.updateCodePreview(this.currentCode)
    },
    methods: {
      onAutoUpdateChanged(value) {
        this.isAutoUpdateEnabled = value
        if (value) this.debounceUpdateCodePreview(this.currentCode)
        Settings.setBoolean(SETTING_IS_AUTO_UPDATE_ENABLED, value)
      },
      onAutoSaveChanged(value) {
        this.isAutoSaveEnabled = value
        Settings.setBoolean(SETTING_IS_AUTO_SAVE_ENABLED, value)
      },
      onRefreshButtonClicked() {
        this.updateCodePreview(this.currentCode)
      },
      saveComponent() {
        this.showSavingToast = true
        this.toastMessage = `Saving component...`
        const hideToast = () => {
          if (this.toastTimeout) clearTimeout(this.toastTimeout)
          this.toastTimeout = setTimeout(() => {
            this.showSavingToast = false
          }, 1000)
        }
        this.$apollo.mutate({
          mutation: MUTATION_UPDATE_COMPONENT_CONTENTS,
          variables: {
            componentId: this.componentId,
            contents: this.currentCode,
          },
//          optimisticResponse: {
//            __typename: `Mutation`,
//            updateComponent: {
//              __typename: `Component`,
//              id: this.componentId,
//              component: this.currentCode,
//            }
//          },
        }).then(() => {
          this.toastMessage = `Saved component successfully.`
          hideToast()
        }).catch(() => {
          this.toastMessage = `Saving the component failed`
          hideToast()
        })
      },
      showConfirmDeleteComponent() {
        this.showDeleteComponentDialog = true
      },
      hideConfirmDeleteComponent() {
        this.showDeleteComponentDialog = false
      },
      deleteComponent() {
        this.hideConfirmDeleteComponent()
        this.$apollo.mutate({
          mutation: MUTATION_DELETE_COMPONENT,
          variables: {
            componentId: this.componentId,
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
        }).then(() => {
          this.$router.push(`/`)
        })
      },
      onCodeMirrorChange(code) {
        this.currentCode = code
        if (this.isAutoSaveEnabled) this.debounceSaveComponent()
        if (this.isAutoUpdateEnabled) this.debounceUpdateCodePreview(this.currentCode)
      }
    },
    watch: {
      code(newCode, oldCode) {
        if (newCode === oldCode) return
        this.updateCodePreview(newCode)
      },
    }
  }
</script>
<style>
  .vcd-code-editor {
    display: flex;
    position: relative;
    flex-basis: 0;
    transition: flex-basis .3s ease;
    overflow: hidden;
  }

  .vcd-code-editor--show {
    flex-basis: 50%;
    border-right: 1px solid rgba(0,0,0,.12);
  }

  .vcd-code-editor .CodeMirror {
    height: auto;
    width: 100%;
    font-size: 10px;
  }

  .vcd-code-editor__buttons {
    position: absolute;
    z-index: 50;
    top: 0;
    right: 0;
  }

  .vcd-code-editor__buttons > * {
    display: block !important;
  }

  .vcd-code-editor__buttons .mu-icon-button {
    opacity: .5;
    transition: opacity .2s;
  }
  .vcd-code-editor__buttons .mu-icon-button.hover {
    opacity: 1;
  }
</style>
