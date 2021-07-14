<template>
  <view class="uni_tab_view" :style="{'transform': 'translate3d(' + view[viewIndex] +'vw, -50vh, 0)'}">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    viewIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      view: [-50, 50, 150]
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_tab_view{
    width: 100vw;
    height: 100vh;
    margin-top: 100rpx;
    position: absolute;
    top: 50vh;
    left: 50vw;
    z-index: 999;
  }
</style>