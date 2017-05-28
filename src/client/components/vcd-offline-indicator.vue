<template>
  <div
    class="vcd-offline-indicator"
    v-bind:class="{
      'vcd-offline-indicator--online': isOnline
    }"
    v-on:mouseenter="onHover"
    v-on:mouseleave="onBlur"
    v-on:click="showInfo"
  >
    <mu-icon
      value="info_outline"
    />
    <mu-tooltip
      :show="isTooltipVisible"
      :label="tooltipText"
      verticalPosition="bottom"
      horizontalPosition="left"
      :touch="true"
    />
    <mu-popup
      position="bottom"
      :open="isInfoVisible"
      v-on:close="hideInfo"
    >
      <mu-appbar
        :title="popupTitle"
      >
        <mu-flat-button
          slot="right"
          label="Close"
          color="white"
          v-on:click="hideInfo"
        />
      </mu-appbar>
      <mu-content-block>
        <p>
          This application works offline!<br>
          You can continue to work on your components.<br>
          <b>Do not close this tab, offline storage is not implemented yet!</b>
        </p>
      </mu-content-block>
    </mu-popup>
  </div>
</template>
<script>
  import Settings, { SETTING_HAS_SHOWN_OFFLINE_INFO } from 'services/settings'
  import muIcon from 'muse-ui/src/icon/icon.vue'
  import muTooltip from 'muse-ui/src/tooltip/tooltip.vue'
  import muPopup from 'muse-ui/src/popup/popup.vue'
  import muAppbar from 'muse-ui/src/appBar/appBar.vue'
  import muFlatButton from 'muse-ui/src/flatButton/flatButton.vue'
  import muContentBlock from 'muse-ui/src/contentBlock/contentBlock.vue'

  export default {
    components: {
      muPopup,
      muTooltip,
      muIcon,
      muAppbar,
      muFlatButton,
      muContentBlock,
    },
    data: () => ({
      isOnline: false,
      isTooltipVisible: false,
      isInfoVisible: false,
    }),
    created() {
      this.updateOnlineStatus = this.updateOnlineStatus.bind(this)
      window.addEventListener(`online`, this.updateOnlineStatus)
      window.addEventListener(`offline`, this.updateOnlineStatus)
      this.updateOnlineStatus()
    },
    beforeDestroy() {
      window.removeEventListener(`online`, this.updateOnlineStatus)
      window.removeEventListener(`offline`, this.updateOnlineStatus)
    },
    methods: {
      updateOnlineStatus() {
        this.isOnline = navigator.onLine

        if (!this.isOnline && !Settings.getBoolean(SETTING_HAS_SHOWN_OFFLINE_INFO, false)) {
          this.showInfo()
          Settings.setBoolean(SETTING_HAS_SHOWN_OFFLINE_INFO, true)
        }
      },
      onHover() {
        this.isTooltipVisible = true
      },
      onBlur() {
        this.isTooltipVisible = false
      },
      showInfo() {
        this.isInfoVisible = true
      },
      hideInfo() {
        this.isInfoVisible = false
      },
    },
    computed: {
      tooltipText() {
        return this.isOnline ? `Online` : `Offline`
      },
      popupTitle() {
        return `Network Status: ${this.tooltipText}`
      }
    },
  }
</script>
<style scoped lang="less">
  @import "~muse-ui/src/styles/import.less";
  .vcd-offline-indicator {
    position: relative;
    color: @yellow300;
    display: flex;
    margin-left: 10px;
    cursor: help;
  }
  .vcd-offline-indicator--online {
    color: @green400;
  }
</style>
