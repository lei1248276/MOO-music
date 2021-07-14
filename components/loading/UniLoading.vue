<template>
  <view class="uni_loading">
    <view class="ball"></view>
    <view class="ball"></view>
    <view class="ball"></view>
  </view>
</template>

<script>
export default {
  name: "UniLoading"
}
</script>

<style scoped lang="scss">
  .uni_loading {
    @include wh(100vw, 100vh);
    position: fixed;
    background-color: $bgc-black2;

    .ball{
      @include wh(60rpx, 60rpx);
      border-radius: 50%;
    }
  }

  .uni_loading :nth-child(1) {
    position: absolute;
    top: 50%;
    left: 45%;
    transform: translate3d(-45%, -50%, 0);
    background-color: $font-color-white;
    animation: move1 1s ease infinite;
  }

  .uni_loading :nth-child(2) {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    transform: translate3d(-50%, -50%, 0);
    background-color: $icon-color-orange;
    animation: narrow 1s ease infinite;
  }

  .uni_loading :nth-child(3) {
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate3d(-55%, -50%, 0);
    background-color: $font-color-white;
    animation: move2 1s ease infinite;
  }

  @keyframes move1 {
    0% {
      left: 45%;
    }
    50% {
      left: 48%;
    }
    100% {
      left: 45%;
    }
  }

  @keyframes narrow {
    0% {
      transform: translate3d(-50%, -50%, 0) scale(1);
    }
    50% {
      transform: translate3d(-50%, -50%, 0) scale(.5);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) scale(1);
    }
  }

  @keyframes move2 {
    0% {
      left: 55%;
    }
    50% {
      left: 52%;
    }
    100% {
      left: 55%;
    }
  }
</style>