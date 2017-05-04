<template>
  <md-list-item>
    <router-link :to="attrHref">
      <md-avatar>
        LEL
      </md-avatar>

      <div class="md-list-text-container">
        <span>{{ name }}</span>
        <p>{{ description }}</p>
      </div>
      <md-button
        class="md-icon-button md-list-action"
        v-on:click.native="onDeleteClicked(id, $event)"
      >
        <md-icon>delete</md-icon>
      </md-button>
    </router-link>
  </md-list-item>
</template>
<script>
  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      onDeleteClicked: {
        type: Function,
        required: true,
      },
    },
    computed: {
      attrHref() {
        return `/${this.id}`
      },
    },
  }
</script>
<style scoped>
  .md-list-item {
    border-bottom: 1px solid rgba(0,0,0,.12);
  }
</style>
