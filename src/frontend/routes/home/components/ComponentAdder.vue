<template>
  <md-dialog
    md-open-from="#component-adder-button"
    md-close-to="#component-adder-button"
    ref="dialogAddNewComponent"
    :md-esc-to-close="allowEscape"
  >
    <md-dialog-title>Add new component</md-dialog-title>

    <md-dialog-content>
      <p>
        Please consider:
        <ul>
          <li>Currently only ES5 code is supported.</li>
          <li>Components can not have childComponents yet.</li>
        </ul>
      </p>
      <form>
        <md-input-container>
          <label>Title</label>
          <md-input
           v-model="title"
          ></md-input>
        </md-input-container>
        <md-input-container>
          <label>Description</label>
          <md-input
            v-model="description"
          ></md-input>
        </md-input-container>
        <md-input-container>
          <label>Single File Component (*.vue)</label>
          <md-file
            v-model="file"
            required
            @selected="onSelectFile"
          >
          </md-file>
        </md-input-container>
      </form>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="onCancel">Cancel</md-button>
      <md-button class="md-primary" @click.native="onCreateClicked">Create</md-button>
    </md-dialog-actions>
  </md-dialog>
  </template>
<script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      onCancel: {
        type: Function,
        required: true,
      },
      onCreate: {
        type: Function,
        required: true,
      }
    },
    data: () => ({
      file: null,
      fileContents: null,
      title: ``,
      description: ``,
      allowEscape: false,
    }),
    watch: {
      show(show) {
        const modalInstance = this.$refs[`dialogAddNewComponent`]
        if (show) {
          modalInstance.open()
          return
        }

        modalInstance.close()
      }
    },
    methods: {
      onSelectFile(file) {
        if (!file.length) {
          return
        }
        const fileToRead = file[0]
        const fileReader = new FileReader
        fileReader.onload = () => {
          this.fileContents = fileReader.result
        }
        fileReader.readAsText(fileToRead)
      },
      onCreateClicked() {
        this.onCreate({
          title: this.title,
          description: this.description,
          component: this.fileContents,
        })
        this.title = ``
        this.description = ``
        this.fileContent = ``
      }
    }
  }
</script>
<style>
  .md-dialog {
    width: 600px;
  }
</style>
