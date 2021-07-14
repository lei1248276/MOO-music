<template>
  <view class="uni_alt" v-once>
    <view>OhMoooo</view>
    <view>Nothing yet</view>
  </view>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
  .uni_alt{
    position: absolute;
    top: 20%;
    left: 50%;
    z-index: 999;
    transform: translate3d(-50%, -20%, 0);
    color: $font-color-white;
    text-align: center;
    font-weight: bold;
  }
  .uni_alt :nth-child(1) {
    width: 100%;
    /* #ifdef APP-PLUS */
    font-size: 180rpx;
    /* #endif */
    /* #ifndef APP-PLUS */
    font-size: 165rpx;
    /* #endif */
    letter-spacing: -18rpx;
  }
</style>