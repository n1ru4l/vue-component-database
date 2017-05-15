<template>
  <mu-icon-menu
    icon="settings"
    :anchorOrigin="menuOrigins"
    :targetOrigin="menuOrigins"
    :itemClickClose="false"
  >
    <mu-menu-item
      class="vcd-code-editor-settings-item"
      leftIcon="autorenew"
      v-on:click="onAutoUpdateChanged(!isAutoUpdateEnabled)"
    >
      <template slot="title">
        Autoupdate
        <mu-switch
          :value="isAutoUpdateEnabled"
          v-on:change="onAutoUpdateChanged"
        />
      </template>
    </mu-menu-item>
    <mu-menu-item
      class="vcd-code-editor-settings-item"
      leftIcon="save"
      :disabled="isAutoSaveDisabled"
      v-on:click="onAutoSaveChanged(!isAutoSaveEnabled)"
    >
      <template slot="title">
        Autosave
        <mu-switch
          :value="isAutoSaveEnabled"
          v-on:change="onAutoSaveChanged"
          :disabled="isAutoSaveDisabled"
        />
      </template>
    </mu-menu-item>
    <mu-menu-item
      v-if="isDeleteEnabled"
      class="vcd-code-editor-settings-item"
      leftIcon="delete"
      title="Delete"
      v-on:click="onDeleteComponentClicked"
    />
  </mu-icon-menu>
</template>
<script>
  import muIconMenu from 'muse-ui/src/iconMenu/iconMenu.vue'
  import muMenuItem from 'muse-ui/src/menu/menuItem.vue'
  import muSwitch from 'muse-ui/src/switch/switch.vue'

  export default {
    components: {
      muIconMenu,
      muSwitch,
      muMenuItem,
    },
    props: {
      isAutoUpdateEnabled: {
        type: Boolean,
        required: true,
      },
      onAutoUpdateChanged: {
        type: Function,
        required: true,
      },
      isAutoSaveEnabled: {
        type: Boolean,
        required: true,
      },
      isAutoSaveDisabled: {
        type: Boolean,
        required: true,
      },
      onAutoSaveChanged: {
        type: Function,
        required: true,
      },
      isDeleteEnabled: {
        type: Boolean,
        required: true,
      },
      onDeleteComponentClicked: {
        type: Function,
        required: true,
      }
    },
    data: () => ({
      menuOrigins: {
        horizontal: `right`,
        vertical: `top`,
      },
    }),
  }
</script>
<style>
  .vcd-code-editor-settings-item .mu-menu-item-title {
    width: 100%;
    display: flex;
    align-items: center;
    overflow: visible;
  }

  .vcd-code-editor-settings-item .mu-switch {
    margin-right: 0;
    margin-left: auto;
  }
</style>
