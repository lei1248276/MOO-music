<template>
  <view class="home_recommend" v-if="recommend.length">
    <image class="recommend_img1"
           :src="recommend[0].picUrl + '?param=100y100'"
           mode="aspectFill"
           lazy-load
           @load="onLoaded">
    </image>
    <image class="recommend_img2"
           :src="recommend[1].picUrl + '?param=100y100'"
           mode="aspectFill"
           lazy-load
           @load="onLoaded">
    </image>
    <image class="recommend_img3"
           :src="recommend[2].picUrl + '?param=100y100'"
           mode="aspectFill"
           lazy-load
           @load="onLoaded">
    </image>
    <view class="recommend_control">
      <view class="control_text">
        <text class="text1">MOO Radio</text>
        <text class="text2">个性好歌推荐</text>
      </view>
      <text class="control iconfont icon-play"
            @click="onPlay"
            :class="[getIsPlay ? 'icon-pause' : 'icon-play']">
      </text>
    </view>
  </view>
</template>

<script>
import {mapState} from 'vuex';

export default {
  props: {
    recommend: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapState({
      getAudio: 'audio',
      getIsPlay: 'isPlay',
      getCurrentSong: 'currentSong',
    })
  },
  created() {
    this.loadImg = 0;
  },
  methods: {
    onLoaded() {
      this.loadImg++;
      if (this.recommend.length === this.loadImg) {
        this.$emit('load', this.loadImg);
      }
    },

    onPlay() {
      if (this.getCurrentSong) {
        this.getIsPlay ? this.getAudio.pause() : this.getAudio.play();
      }
      console.log(this.getAudio.paused);
    },
  }
}
</script>

<style scoped lang="scss">
  .home_recommend{
    @include wh($container-size, 140rpx);
    position: relative;
    background-color: $bgc-black1;
    border-radius: 60rpx;
    margin: 0 auto 50rpx;
    .recommend_img1{
      @include wh(26%, 100%);
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 8rpx;
    }
    .recommend_img2{
      @include wh(26%, 120%);
      position: absolute;
      left: 10%;
      bottom: 0;
      z-index: 100;
      border-radius: 8rpx;
    }
    .recommend_img3{
      @include wh(26%, 100%);
      position: absolute;
      left: 20%;
      top: 0;
      border-radius: 8rpx;
    }
    .recommend_control{
      @include wh(46%, 84%);
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 58%;
      transform: translate3d(-20%, -50%, 0);
      .control_text{
        @include wh(80%, 100%);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .text1{
          color: $font-color-white;
          font-weight: bold;
          font-size: 38rpx;
        }
        .text2{
          color: $font-color-grey;
          font-size: 30rpx;
          letter-spacing: 8rpx;
        }
      }
      .control{
        font-size: 80rpx;
        color: $icon-color-orange;
      }
    }
  }
</style>