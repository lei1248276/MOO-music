<template>
  <view class="uni_swiper_dot">
    <view class="dot_item" v-for="(item, index) in count" :key="index"
          :class="{active: index === currentIndex}">
    </view>
  </view>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 1
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
}
</script>

<style scoped lang="scss">
  .uni_swiper_dot{
    display: flex;
    .dot_item{
      width: 18rpx;
      height: 18rpx;
      border-radius: 50%;
      background-color: $font-color-grey;
      transition: all .5s;
      margin-right: 8rpx;
    }
    .active{
      width: 36rpx;
      height: 18rpx;
      border-radius: 20rpx;
      background-color: $font-color-white;
      transition: all .5s ease;
      margin-right: 8rpx;
    }
  }
</style>