<template>
  <view class="uni_nav">
    <slot name="title">
      <text class="nav_title">{{ title }}</text>
    </slot>
    <slot name="flag">
      <button class="nav_flag iconfont" :class="flag" plain hover-class="hover_flag"></button>
    </slot>
  </view>
</template>

<script>
export default {
   props: {
    title: {
      type: String,
      default: ""
    },
    flag: {
      type: String,
      default: "icon-arrow"
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_nav{
    @include wh($container-size, 50rpx);
    color: $font-color-white;
    font-size: 34rpx;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 50rpx;
    .nav_flag{
      color: $font-color-grey;
      font-size: 38rpx;
      border: none;
      border-radius: 50%;
      position: absolute;
      right: 2%;
    }
    .hover_flag{
      @include hover();
    }
  }
</style>