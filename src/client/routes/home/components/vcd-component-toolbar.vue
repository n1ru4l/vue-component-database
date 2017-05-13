<template>
  <div class="vcd-component-toolbar">
    <div class="component-toolbar__meta">
      <strong>Title</strong>: {{component.title}}<br>
      <strong>Description</strong>: {{component.description}}
    </div>
    <div class="vcd-component-toolbar__download">
      <mu-float-button
        icon="file_download"
        secondary
        mini
        v-on:click.native="onDownloadButtonClicked"
      />
    </div>
  </div>
</template>
<script>
  import muFloatButton from 'muse-ui/src/floatButton/floatButton.vue'

  /**
   * Might not work in IE
   * @source http://stackoverflow.com/a/18197341/4202031
   * @param filename
   * @param text
   */
  function download(filename, text) {
    const pom = document.createElement(`a`)
    pom.setAttribute(`href`, `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
    pom.setAttribute(`download`, filename)

    if (!document.createEvent) {
      pom.click()
      return
    }
    const event = document.createEvent(`MouseEvents`)
    event.initEvent(`click`, true, true)
    pom.dispatchEvent(event)
  }

  export default {
    components: {
      muFloatButton,
    },
    props: {
      component: {
        type: Object,
        required: false,
      },
    },
    methods: {
      onDownloadButtonClicked() {
        const { component } = this.component
        download(`component.vue`, component) // @TODO: component-name should be specified
      },
    },
  }
</script>
<style scoped>
    .vcd-component-toolbar {
      display: flex;
      align-self: flex-end;
      flex-shrink: 0;
      padding: 10px;
      width: 100%;
      color: white;
      background-color: #7e57c2;
    }
    .vcd-component-toolbar__download {
      margin-right: 0;
      margin-left: auto;
    }
</style>
