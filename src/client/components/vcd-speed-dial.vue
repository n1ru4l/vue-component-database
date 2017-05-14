<template>
  <span
   class="vcd-speed-dial"
   v-on:mouseover="onHover"
   v-on:mouseleave="onBlur"
   v-bind:class="{ 'vcd-speed-dial--active': isActive }"
  >
    <mu-float-button
      class="vcd-speed-dial__trigger"
      :secondary="secondary"
      :mini="mini"
    >
      <mu-icon :value="icon" />
      <mu-icon :value="iconActive" />
    </mu-float-button>
    <slot/>
  </span>
</template>
<script>
  import muFloatButton from 'muse-ui/src/floatButton/floatButton.vue'
  import muIcon from 'muse-ui/src/icon/icon.vue'

  export default {
    props: {
      icon: {
        type: String,
        required: true,
      },
      iconActive: {
        type: String,
        required: true,
      },
      direction: {
        type: String,
      },
      secondary: {
        type: Boolean,
      },
      mini: {
        type: Boolean,
      }
    },
    data: () => ({
      isActive: false,
    }),
    components: {
      muFloatButton,
      muIcon,
    },
    methods: {
      onHover() {
        this.isActive = true
      },
      onBlur() {
        this.isActive = false
      }
    }
  }
</script>
<style scoped lang="less">
  .vcd-speed-dial {
    display: flex;
    flex-direction: column-reverse;
    pointer-events: none;
  }

  .vcd-speed-dial--active {
    pointer-events: all;
  }

  .vcd-speed-dial > .vcd-speed-dial__trigger {
    pointer-events: all;
    z-index: 10;
  }

  .vcd-speed-dial > .vcd-speed-dial__trigger .mu-icon {
    transition: all .3s;
    transition-property: transform, opacity;
  }

  .vcd-speed-dial > .vcd-speed-dial__trigger .mu-icon:first-child {
    transform: translateX(50%) rotate(0);
    opacity: 1;
  }
  .vcd-speed-dial--active > .vcd-speed-dial__trigger .mu-icon:first-child {
    transform: translateX(50%) rotate(45deg);
    opacity: 0;
  }
  .vcd-speed-dial > .vcd-speed-dial__trigger .mu-icon:last-child {
    transform: translateX(-50%) rotate(-45deg);
    opacity: 0;
  }
  .vcd-speed-dial--active > .vcd-speed-dial__trigger .mu-icon:last-child {
    transform: translateX(-50%) rotate(0);
    opacity: 1;
  }

  .vcd-speed-dial > *:not(.vcd-speed-dial__trigger) {
    transform: scale(.8) translate3D(0, 80%, 0);
    opacity: 0;
  }

  .vcd-speed-dial--active > *:not(.vcd-speed-dial__trigger) {
    transform: scale(.8) translate3D(0, 0%, 0);
    opacity: 1;
    pointer-events: all;
  }

  // Left
  .vcd-speed-dial--left .vcd-speed-dial__icons > * {
    transform: scale(.8) translate3D(-80%, 0, 0);
  }

  .vcd-speed-dial--left .vcd-speed-dial__icons {
    flex-direction: row-reverse;
    justify-content: center;
  }
</style>
