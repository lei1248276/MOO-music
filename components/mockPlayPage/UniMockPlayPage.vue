<template>
  <uni-transition class="transition"
                  :mode-class="['slide-right']"
                  :show="isShow">

    <view class="iconfont icon-back"
          @click="offPlayPage">
    </view>

    <uni-play-page></uni-play-page>

  </uni-transition>
</template>

<script>
import UniPlayPage from "@/components/playPage/UniPlayPage";

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UniPlayPage
  },
  methods: {
    offPlayPage() {
      this.$emit('update:isShow', false);
    },
  }
}
</script>

<style scoped lang="scss">
  .transition{
    width: 100vw;
    height: 100vh;
    background-color: $bgc-black2;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    transition: all .3s ease;

    .view{
      width: 100vw;
      height: 100vh;
    }

    .icon-back{
      @include wh(150rpx, 120rpx);
      line-height: 120rpx;
      text-align: center;
      position: absolute;
      top: 6%;
      left: 2%;
      z-index: 1;
      color: $font-color-white;
      font-size: $icon-size;
    }
  }
</style>