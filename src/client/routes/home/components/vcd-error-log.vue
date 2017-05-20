<template>
  <div class="vcd-error-log" ref="elErrorLog">
    <div v-for="error in displayErrors" class="vcd-error-log__error">
      {{error}}
    </div>
  </div>
</template>
<script>
  import { stripIndent } from 'common-tags'

  export default {
    props: {
      errors: {
        type: Array,
        required: true,
      },
    },
    computed: {
      displayErrors() {
        return this.errors.map(err => (stripIndent`${err}`).trim())
      },
      errorAmount() {
        return this.displayErrors.length
      }
    },
    watch: {
      displayErrors: {
        handler() {
          this.jumpToBottom()
        },
        deep: true,
      },
    },
    methods: {
      jumpToBottom() {
        this.$nextTick(() => {
          const { elErrorLog } = this.$refs
          if (!elErrorLog) return
          elErrorLog.scrollTop = elErrorLog.scrollHeight
        })
      },
    },
  }
</script>
<style scoped>
  .vcd-error-log {
    padding-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: #FFCDD2;
    color: #C62828;
    height: 50%;
    overflow-y: scroll;
  }
  .vcd-error-log__error {
    white-space: pre;
    font-family: 'Roboto Mono', monospace;
    font-size: 1rem;
  }
</style>
