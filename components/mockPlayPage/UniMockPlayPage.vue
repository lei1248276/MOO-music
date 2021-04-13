<template>
  <view class="transition"
        :class="[isShow && delay ? 'show' : 'hide']"
        @touchstart="onTouchstart"
        @touchmove="onTouchmove($event)"
        @touchend="onTouchend">

    <view class="iconfont icon-back"
          @click="offPlayPage">
    </view>

    <uni-play-page></uni-play-page>

  </view>
</template>

<script>
import UniPlayPage from "@/components/playPage/UniPlayPage";

import {throttle} from "@/util/index";

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      delay: false
    }
  },
  components: {
    UniPlayPage
  },
  created() {
    // 组件生成以后加延迟触发过渡
    let t = this.$store.state.currentPlayQueue.length > 50 ? 170 : 85;

    setTimeout(() => {
      this.delay = true;
    },t);
  },
  methods: {
    offPlayPage() {
      this.$emit('update:isShow', false);
    },

    onTouchstart(e) {
      this.startX = e.touches[0].clientX;
    },

    onTouchmove: throttle(function(e) {
      this.isReach = e.touches[0].clientX - this.startX > 10;
    }, 100),

    onTouchend() {
      if (this.isReach) {
        this.$emit('update:isShow', false);
        this.isReach = false;
      }
    }
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
  .show{
    transform: translate3d(0, 0, 0);
  }
  .hide{
    transform: translate3d(100%, 0, 0);
  }
</style>