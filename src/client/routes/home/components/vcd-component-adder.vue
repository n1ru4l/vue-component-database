<template>
  <mu-dialog
    :open="show"
    title="Add new component"
  >
    <p>
      Please consider:
      <ul>
        <li>Currently only ES2015 code is supported.</li>
        <li>Components can not have childComponents yet.</li>
      </ul>
    </p>
    <form>
      <mu-text-field
        label="Title"
        v-model="title"
        fullWidth
      />
      <mu-text-field
        label="Description"
        v-model="description"
        fullWidth
      />
      <mu-raised-button
        label="Choose Single File COmponent (.vue)"
      >
        <input
          type="file"
          class="file-button"
          @change="onSelectFile"
        >
      </mu-raised-button>
    </form>
    <mu-flat-button
      slot="actions"
      @click="onCancel"
      label="Close"
    />
    <mu-flat-button
      slot="actions"
      @click="onCreateClicked"
      label="Create"
    />
  </mu-dialog>
</template>
<script>
  import muDialog from 'muse-ui/src/dialog'
  import muTextField from 'muse-ui/src/textField'
  import muFlatButton from 'muse-ui/src/flatButton'
  import muRaisedButton from 'muse-ui/src/raisedButton'

  export default {
    components: {
      muDialog,
      muTextField,
      muFlatButton,
      muRaisedButton,
    },
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
      },
    },
    data: () => ({
      file: null,
      fileContents: null,
      title: ``,
      description: ``,
    }),
    methods: {
      onSelectFile(ev) {
        const { files } = ev.target
        if (!files.length) {
          return
        }
        const fileToRead = files[0]
        const fileReader = new FileReader()
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
        this.fileContents = ``
      },
    },
    computed: {
      isFormInvalid() {
        if (!this.fileContents) {
          return true
        } else if (!this.title) {
          return true
        } else if (!this.description) {
          return true
        }

        return false
      },
    },
  }
</script>
<style>
  .file-button{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
  }

  .md-dialog {
    width: 600px;
  }
</style>
