<template>
  <view class="uni_custom_checkbox"
        :class="[checked ? 'select' : '']">
    <view v-show="checked" class="iconfont icon-select"></view>
  </view>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style scoped lang="scss">
  .uni_custom_checkbox{
    @include wh(50rpx, 50rpx);
    position: relative;
    z-index: 1111;
    border: 1rpx solid $font-color-grey;
    margin-right: 30rpx;
    border-radius: 10rpx;
    text-align: center;

    .icon-select{
      color: $bgc-black1;
      font-size: 54rpx;
      font-weight: bold;
    }
  }
  .select{
    background-color: $icon-color-orange;
    border: 1rpx solid $icon-color-orange;
  }
</style>