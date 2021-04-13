<template>
  <view class="uni_song_queue"
        :class="[isShow && delay ? 'show' : 'hide']"
        @touchstart="onTouchstart"
        @touchmove="onTouchmove($event)"
        @touchend="onTouchend">

    <view v-show="isShow" class="iconfont icon-arrow"></view>

    <view class="box">

      <scroll-view class="scroll"
                   scroll-y
                   @scrolltolower="onLoadMore">

        <view class="detail">
          <view class="cover">
            <image :src="getCurrentSong.picUrl + '?param=200y200'"
                   class="img">
            </image>
          </view>

          <view class="name">{{getCurrentSong.name}}</view>
          <view class="singer">{{getCurrentSong.singer}}</view>
        </view>

        <view class="functional">
          <view class="iconfont icon-download"></view>
          <view class="iconfont icon-send"></view>
          <view class="iconfont icon-add"></view>
          <view class="iconfont icon-message"></view>
          <view class="iconfont icon-album"></view>
        </view>

        <uni-song-control class="control"
                          :count="getCurrentPlayQueue.length">
        </uni-song-control>

        <uni-song class="view_item"
                  :songs="renderQueue"
                  :playlistId="getCurrentPlayQueue[0].playlistId">
        </uni-song>

      </scroll-view>
    </view>
  </view>
</template>

<script>
import UniSongControl from "@/components/songControl/UniSongControl";
import UniSong from "@/components/song/UniSong";

import {throttle} from "@/util/index";
import {mapState} from "vuex"

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UniSongControl,
    UniSong
  },
  data() {
    return {
      limit: 10,
      delay: false,
      renderQueue: []
    }
  },
  created() {
    this.renderQueue = Object.seal(this.getRenderSongs(0, this.limit));

    // 组件生成以后加延迟触发过渡
    setTimeout(() => {
      this.delay = true;
    },17)
  },
  computed: {
    ...mapState({
      getCurrentPlayQueue: 'currentPlayQueue',
      getCurrentSong: 'currentSong',
    })
  },
  methods: {
    // 获取当前需要渲染的歌曲
    getRenderSongs(offset, limit) {
      return this.getCurrentPlayQueue.slice(offset, limit + offset);
    },

    // 监听滑动到底部加载更多
    onLoadMore() {
      const renderQueue = this.renderQueue;
      if (renderQueue.length === this.getCurrentPlayQueue.length) return;
      this.renderQueue = Object.seal(renderQueue.concat(this.getRenderSongs(renderQueue.length, this.limit)));
    },

    onTouchstart(e) {
      this.startY = e.touches[0].clientY;
    },

    onTouchmove: throttle(function(e) {
      this.isReach = e.touches[0].clientY - this.startY > 10;
    }, 100),

    onTouchend() {
      if (this.isReach) {
        this.$emit('update:isShow', false);
        this.isReach = false;
      }
    }
  },
  watch: {
    // 切换歌单更新renderQueue
    getCurrentPlayQueue(val,oldVal) {
      if (val[0].playlistId !== oldVal[0].playlistId) {
        this.renderQueue = Object.seal(this.getRenderSongs(0, this.limit));
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_song_queue{
    @include wh(100%, 100%);
    position: absolute;
    z-index: 1000;
    transition: all .5s ease;
    overflow: hidden;

    .icon-arrow{
      position: absolute;
      left: 50%;
      transform: translateX(-50%) rotate(90deg);
      color: $font-color-white;
    }

    .box{
      @include wh(100%, 100%);
      position: absolute;
      background-color: rgba(0, 0, 0, .5);

      .detail{
        @include wh(82%, 35%);
        margin: 300rpx auto 0;
        font-size: 36rpx;

        .cover{
          @include wh(300rpx, 300rpx);
          margin-bottom: 50rpx;
          .img{
            @include wh(100%, 100%);
            border-radius: 12rpx;
          }
        }

        .name{
          color: $font-color-white;
        }
        .singer{
          color: $font-color-grey;
        }
      }

      .functional{
        @include wh(90%, 13%);
        margin: 0 auto 100rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        text-align: center;
        color: $font-color-white;
        .iconfont{
          font-size: $icon-size;
          width: 25%;
        }
      }

      .control{

      }

      .scroll{
        @include wh(100%, 100%);
        position: absolute;
        color: $font-color-white;
        font-size: 40rpx;

        .view_item{
          width: 90%;
          margin: 0 auto;
          padding-bottom: 150rpx;
        }
      }
    }
  }
  .show{
    transform: translate3d(0, 0, 0);
  }
  .hide{
    transform: translate3d(0, 100%, 0);
  }
</style>