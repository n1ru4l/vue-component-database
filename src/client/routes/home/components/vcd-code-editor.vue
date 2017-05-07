<template>
  <cm-code-mirror
    class="vcd-code-editor"
    v-bind:class="{ 'vcd-code-editor--show': isVisible }"
    :options="editorOptions"
    :value="code"
  />
</template>
<script>
  import cmCodeMirror from 'vue-codemirror-lite/codemirror.vue'
  import 'codemirror/mode/vue/vue'

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
    data: () => ({
      editorOptions: {
        tabSize: 2,
        mode: `text/x-vue`,
        lineNumbers: true,
        line: true,
        styleSelectedText: true,
      },
    }),
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
