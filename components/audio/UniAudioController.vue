<template>
  <view class="uni_audio_controller">

    <movable-area class="mov_area">
      <movable-view class="mov_view"
                    direction="horizontal" :x="x"
                    @change="onMove($event)"
                    @touchend="onTouchend">
        <image src="~@/static/record.png"
               class="audio_img"
               :class="[getIsPlay ? 'audio_anim_play' : 'audio_anim_pause']">
        </image>
      </movable-view>
    </movable-area>

    <view class="prompt">{{oldX > 0 ? 'NEXT' : 'LAST'}}</view>

    <text class="playTime"
          :class="[getIsPlay ? 'active' : '']">
      {{ getCurrentTime | playTime }}
    </text>

    <view class="control" @click.stop="onPlay">
      <text class="iconfont"
            :class="[getIsPlay ? 'icon-audioPause' : 'icon-audioPlay']">
      </text>
    </view>

  </view>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {throttle} from '@/util/index';

import types from "@/store/mutations-types";

export default {
  data() {
    return {
      x: 0,
      oldX: 0
    }
  },
  computed: {
    ...mapState({
      getIsInit: 'isInit',
      getAudio: 'audio',
      getIsPlay: 'isPlay',
      getCurrentTime: 'currentTime',
      getCurrentSong: 'currentSong',
      getShowPageIndex: 'showPageIndex'
    }),

  },
  methods: {
    ...mapMutations([
        types.SET_IS_INIT,
        types.SET_SHOW_PAGE_INDEX
    ]),

    onPlay() {
      if (this.getCurrentSong && !this.getIsInit) {
        this.$store.dispatch('getPlaySong', this.getCurrentSong);
        this[types.SET_IS_INIT]();
      } else{
        if (this.getCurrentSong) {
          this.getIsPlay ? this.getAudio.pause() : this.getAudio.play();
        }
      }
    },

    onMove: throttle(function (e) {
      this.oldX = e.detail.x;
    }, 17),

    onTouchend() {
      const index = this.getShowPageIndex;
      if (this.oldX > 60) {
        // 右划下一曲
        if (index < 2) this[types.SET_SHOW_PAGE_INDEX](index + 1);
        else if (index === 2) this[types.SET_SHOW_PAGE_INDEX](0);
      } else if (this.oldX < -60) {
        // 左划上一曲
        if (index > 0) this[types.SET_SHOW_PAGE_INDEX](index - 1);
        else if (index === 0) this[types.SET_SHOW_PAGE_INDEX](2);
      }
      this.x = this.oldX;
      this.$nextTick(() => {
        this.x = 0;
      })
    }
  },
  filters: {
    playTime(t) {
      let m = 0, s = 0;
      if (!t) return '00:00';
      m = Math.floor(t / 60) + '';
      s = Math.floor(t % 60) + '';
      m.length === 1 && (m = '0' + m);
      s.length === 1 && (s = '0' + s);
      return m + ':' + s;
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_audio_controller{
    @include wh(60%, 110rpx);
    background-color: $bgc-black1;
    border-radius: 60rpx;
    position: fixed;
    bottom: 2%;
    left: 6%;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .mov_area{
      @include wh(100%, 130rpx);
      //position: absolute;
      .mov_view{
        @include wh(130rpx, 130rpx);
        left: 38%;
        z-index: 1001;
        .audio_img{
          @include wh(100%, 100%);
        }
      }
    }

    .playTime{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      color: $font-color-grey;
      font-size: 48rpx;
      font-weight: bold;
      padding-left: 20rpx;
    }
    .active{
      color: $font-color-white;
    }

    .prompt{
      position: absolute;
      top: 50%;
      left: 52%;
      transform: translate3d(-52%, -50%, 0);
      color: $font-color-white;
      font-size: 46rpx;
    }

    .control{
      @include wh(100rpx, 100%);
      position: absolute;
      right: 1%;
      z-index: 1000;
      .icon-audioPlay{
        position: absolute;
        top: 50%;
        right: 20%;
        transform: translate3d(-20%, -50%, 0);
        font-size: 42rpx;
        color: $font-color-white;
      }
      .icon-audioPause{
        @extend .icon-audioPlay;
        color: $font-color-grey;
      }
    }

    .audio_anim_play{
      animation: audioPlay 8s linear infinite;
      animation-play-state: running;
    }
    .audio_anim_pause{
      animation: audioPlay 8s linear infinite;
      animation-play-state: paused;
    }
  }

  @keyframes audioPlay {
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>