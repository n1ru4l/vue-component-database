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
      v-model="currentCode"
      ref="leEditor"
    />
    <mu-toast
      v-if="showSavingToast"
      :message="toastMessage"
    />
  </div>
</template>
<script>
  import MUTATION_UPDATE_COMPONENT_CONTENTS from 'graphql-docs/mutations/update-component-contents.graphql'
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

  export default {
    components: {
      cmCodeMirror,
      vcdCodeEditorSettings,
      muIconButton,
      muToast,
    },
    props: {
      onCodeChanged: {
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
        this.debounceCodeChanged()
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
        isAutoUpdateEnabled: Settings.getBoolean(SETTING_IS_AUTO_UPDATE_ENABLED) || true,
        isAutoSaveEnabled: Settings.getBoolean(SETTING_IS_AUTO_SAVE_ENABLED) || false,
        showSavingToast: false,
        toastMessage: `Saving component...`,
        toastTimeout: null,
        lastRefreshedCode: null,
        timeoutAutoSaveDisabledTemporary: null,
      }
    },
    // computed
    computed: {
      isSaveDisabled() {
        return this.code === this.currentCode
      },
      isAutoSaveDisabled() {
        return this.currentUserId !== this.componentAuthorId
      },
      isAutoSaveDisabledTemporary() {
        return !!this.timeoutAutoSaveDisabledTemporary
      },
    },
    // lifecycle
    created() {
      this.disableAutoSaveTemporary()
      this.currentCode = this.code
      this.debounceCodeChanged = debounce(() => {
        this.onCodeChanged(this.currentCode)
      }, 500)
      this.autoSaveComponent = debounce(() => {
        this.saveComponent()
      }, 1000)
      this.onCodeChanged(this.currentCode)
    },
    methods: {
      onAutoUpdateChanged(value) {
        this.isAutoUpdateEnabled = value
        if (value) this.debounceCodeChanged()
        Settings.setBoolean(SETTING_IS_AUTO_UPDATE_ENABLED, value)
      },
      onAutoSaveChanged(value) {
        this.isAutoSaveEnabled = value
        Settings.setBoolean(SETTING_IS_AUTO_SAVE_ENABLED, value)
      },
      onRefreshButtonClicked() {
        this.debounceCodeChanged()
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
        }).then(() => {
          this.toastMessage = `Saved component successfully.`
          hideToast()
        }).catch(() => {
          this.toastMessage = `Saving the component failed`
          hideToast()
        })
      },
      disableAutoSaveTemporary() {
        if (this.timeoutAutoSaveDisabledTemporary) {
          clearTimeout(this.timeoutAutoSaveDisabledTemporary)
        }
        this.timeoutAutoSaveDisabledTemporary = setTimeout(() => {
          this.timeoutAutoSaveDisabledTemporary = null
        }, 2000)
      },
    },
    watch: {
      code(newCode, oldCode) {
        if (newCode === oldCode) return
        this.currentCode = newCode
        this.debounceCodeChanged()
      },
      currentCode() {
        if (this.isAutoSaveEnabled && !this.isAutoSaveDisabledTemporary) {
          this.autoSaveComponent()
          return
        }
        if (!this.isAutoUpdateEnabled) return
        this.debounceCodeChanged()
      },
    },
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
    display: block;
  }

  .vcd-code-editor__buttons .mu-icon-button {
    opacity: .5;
    transition: opacity .2s;
  }
  .vcd-code-editor__buttons .mu-icon-button.hover {
    opacity: 1;
  }
</style>
