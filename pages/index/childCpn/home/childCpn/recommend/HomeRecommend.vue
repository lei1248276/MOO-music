<template>
  <view class="home_recommend" v-if="recommend.length">
    <image v-for="(item, index) in recommend.slice(0, 3)"
           :key="item.id"
           :class="`recommend_img${index + 1}`"
           :src="item.picUrl + '?param=100y100'"
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
import {mapState, mapMutations} from 'vuex';
import types from "@/store/mutations-types";

export default {
  props: {
    recommend: {
      type: Array,
      default() {
        return []
      }
    },
    songs: {
      type: Array,
      default(){
        return []
      }
    }
  },
  computed: {
    ...mapState({
      getIsInit: 'isInit',
      getAudio: 'audio',
      getIsPlay: 'isPlay',
      getCurrentSong: 'currentSong',
    }),
  },
  created() {
    this.loadImg = 0;
  },
  methods: {
    ...mapMutations([
        types.SET_IS_INIT,
        types.SET_RESET_PAGE_INDEX,
        types.SET_CURRENT_PLAY_INDEX,
        types.SET_CURRENT_PLAY_QUEUE,
    ]),
    onLoaded() {
      this.loadImg++;
      if (this.recommend.length === this.loadImg) {
        this.$emit('load', this.loadImg);
      }
    },

    onPlay() {
      !this.getIsInit && this[types.SET_IS_INIT]()

      this.getIsPlay && this.getAudio.pause()

      const playlistId = this.recommend[0].id
      const songsInfo = this.reload(this.songs, [], playlistId);
      // 设置当前播放队列
      this[types.SET_CURRENT_PLAY_QUEUE](songsInfo);
      // 获取歌曲链接
      this.$store.dispatch('getPlaySong', songsInfo[0]);
      // 重置playPage当前页面index
      this[types.SET_RESET_PAGE_INDEX](0);
      // 设置当前播放歌曲 index
      this[types.SET_CURRENT_PLAY_INDEX](0);
    },

    reload(songs, curPlayQueue, curPlId) {
      let songsInfo = [];
      for (let i = curPlayQueue.length, len = songs.length; i < len; i++) {
        // 设置歌曲信息
        songsInfo.push({
          playlistId: curPlId,
          id: songs[i].id,
          picUrl: songs[i].picUrl,
          songUrl: songs[i].songUrl || '',
          lyric: songs[i].lyric || '',
          name: songs[i].name,
          singer: songs[i].singer,
          isCollect: false,
          isChecked: false,
        });
      }
      return songsInfo;
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
