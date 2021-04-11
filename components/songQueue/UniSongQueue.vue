<template>
  <view class="uni_song_queue"
        :class="[isShow && delay ? 'show' : 'hide']">

    <view v-show="isShow" class="iconfont icon-arrow"></view>

    <view class="box">

      <view class="detail" @click.stop="offSongQueue"></view>

      <uni-song-control class="control"
                        :count="getCurrentPlayQueue.length">
      </uni-song-control>

      <scroll-view class="scroll"
                   scroll-y
                   @scrolltolower="onLoadMore">

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
    getCurrentPlayQueue() {
      return this.$store.state.currentPlayQueue
    },
  },
  methods: {
    offSongQueue() {
      this.$emit('update:isShow', false);
    },

    // 获取当前需要渲染的歌曲
    getRenderSongs(offset, limit) {
      return this.getCurrentPlayQueue.slice(offset, limit + offset);
    },

    // 监听滑动到底部加载更多
    onLoadMore() {
      const renderQueue = this.renderQueue;
      if (renderQueue.length === this.getCurrentPlayQueue.length) return;
      this.renderQueue = Object.seal(renderQueue.concat(this.getRenderSongs(renderQueue.length, this.limit)));
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
        @include wh(100%, 45%);
      }

      .control{
        position: absolute;
        top: 45%;
        left: 3%;
      }

      .scroll{
        @include wh(100%, 100%);
        position: absolute;
        top: 53%;
        color: $font-color-white;
        font-size: 40rpx;

        .view_item{
          width: 90%;
          margin: 0 auto;
          padding-bottom: 900rpx;
        }
      }
    }
  }
  .show{
    transform: translate3d(0, 0, 0);
  }
  .hide{
    transform: translate3d(100%, 100%, 0);
  }
</style>