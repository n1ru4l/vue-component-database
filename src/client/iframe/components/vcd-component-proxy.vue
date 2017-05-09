<script>
  export default {
    props: {
      options: {
        required: true,
      },
      properties: {
        type: Object,
        required: true,
      },
    },
    render(h) {
      return h(this.options, {
        props: this.properties,
      })
    },
  }
</script>
