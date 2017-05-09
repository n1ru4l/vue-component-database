<template>
  <cm-code-mirror
    class="vcd-code-editor"
    v-bind:class="{ 'vcd-code-editor--show': isVisible }"
    :options="editorOptions"
    v-model="currentCode"
    ref="leEditor"
  />
</template>
<script>
  import cmCodeMirror from 'vue-codemirror-lite/codemirror.vue'
  import 'codemirror/mode/vue/vue'
  import { debounce } from 'lodash'

  export default {
    components: {
      cmCodeMirror,
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
      }
    },
    created() {
      this.currentCode = this.code
      this.debounceCodeChanged = debounce(() => {
        this.onCodeChanged(this.currentCode)
      }, 500)
      this.onCodeChanged(this.currentCode)
    },
    watch: {
      code(newCode, oldCode) {
        if (newCode === oldCode) return
        this.currentCode = newCode
        this.debounceCodeChanged()
      },
    },
  }
</script>
<style>
  .vcd-code-editor + .CodeMirror {
    height: auto;
    flex-basis: 0;
    transition: flex-basis .3s ease;
    font-size: 10px;
  }

  .vcd-code-editor--show + .CodeMirror {
    flex-basis: 50%;
    border-right: 1px solid rgba(0,0,0,.12);
  }
</style>
