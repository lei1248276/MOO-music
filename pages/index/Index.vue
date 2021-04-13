<template>
  <view class="index">
    <view class="nav">
      <view :class="[current ? 'show' : 'hide']">DISCOVER</view>
      <view :class="[current ? 'hide' : 'show']">PLAY</view>
      <text class="iconfont icon-user"></text>
    </view>

    <uni-swiper-dot class="swiper_dots"
                    :count="2"
                    :currentIndex="current">
    </uni-swiper-dot>

    <swiper class="swiper"
            :current="current"
            duration="300"
            @change="onChange">

      <swiper-item>
        <uni-play-page></uni-play-page>
      </swiper-item>

      <swiper-item>
        <home ref="home"></home>
      </swiper-item>

    </swiper>

    <uni-audio-controller :class="[current ? 'show' : 'hide']"
                          @click.native="toPlayPage">
    </uni-audio-controller>
  </view>
</template>

<script>
import Home from './childCpn/home/Home';
import UniSwiperDot from '@/components/swiperDot/UniSwiperDot';
import UniPlayPage from '@/components/playPage/UniPlayPage';

	export default {
		data() {
			return {
				imgs: [],
        current: 1,
			}
		},
		components: {
			Home,
      UniPlayPage,
      UniSwiperDot
		},
		methods: {
      onChange(e) {
        this.current = e.detail.current;
        this.$refs.home.onAutoplay();
      },

      toPlayPage() {
        this.current = 0;
      }
		},
    onShow() {
      if (this.$refs.home) {
        this.$refs.home.onAutoplay();
      }
    },
    onHide() {
      this.$refs.home.onAutoplay();
    }
	}
</script>

<style scoped lang="scss">
  .index{
    background-color: $bgc-black2;

    .swiper_dots{
      position: fixed;
      top: 11%;
      left: 5%;
      right: 0;
      z-index: 1000;
    }
    .nav{
      @include wh($container-size, 100rpx);
      position: fixed;
      top: 4%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      font-size: 70rpx;
      font-weight: bold;
      color: $font-color-white;
      display: flex;
      align-items: center;
      .icon-user{
        position: absolute;
        right: 0;
        font-size: $icon-size;
      }
    }
    .show{
      position: absolute;
      transition: all .5s linear;
      opacity: 1;
    }
    .hide{
      @extend .show;
      opacity: 0;
      z-index: -1;
    }

    .swiper{
      position: relative;
      height: 100vh;
    }
  }
</style>
