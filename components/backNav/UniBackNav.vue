<template>
  <view class="uni_back_nav">
    <button class="btn"
            @click="toBack"
            size="mini"
            plain
            hover-class="hover_flag">
      <text class="iconfont icon-back"></text>
    </button>
    <slot>
      <text v-if="title" class="title">{{title}}</text>
    </slot>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    toBack() {
      uni.navigateBack({
        delta: 1
      })
    },
  }
}
</script>

<style scoped lang="scss">
  .uni_back_nav{
    @include wh(100%, 14%);
    /* #ifndef MP-WEIXIN */
    background-color: $bgc-black2;
    /* #endif */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    .btn{
      @include wh(120rpx, 120rpx);
      float: left;
      margin: 80rpx 0 0 10rpx;
      border: none;
      border-radius: 50%;
      .icon-back{
        color: $font-color-white;
        font-size: 50rpx;
        font-weight: bold;
      }
    }
    .hover_flag{
      @include hover();
    }

    .title{
      color: $font-color-white;
      font-size: 38rpx;
      text-align: center;
      font-weight: bold;
      position: absolute;
      /* #ifndef APP-PLUS */
      bottom: 15%;
      /* #endif */
      /* #ifdef APP-PLUS */
      bottom: 28%;
      /* #endif */
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>