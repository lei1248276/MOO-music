<template>
  <view class="uni_song">
    <view class="song_container"
          @click.stop="onPlay(item, index)"
          v-for="(item, index) in songs" :key="item.id">

      <view class="anim"
            :class="[currentIndex === index ? 'clickAnim' : '']">
      </view>

      <uni-custom-checkbox v-if="selectable"
                           ref="checkbox" :checked="item.isChecked"
                           @click.native.stop="onSelect(item)">
      </uni-custom-checkbox>

      <image :src="item.picUrl + '?param=70y70'"
             mode="widthFix"
             lazy-load
             class="song_img">
      </image>

      <view class="song_detail">
        <view class="song_name">{{ item.name }}</view>
        <view class="singer">{{ item.singer}}</view>
      </view>

      <uni-sound-wave v-if="getCurrentSong && getCurrentSong.id === item.id"
                      :run="getIsPlay">
      </uni-sound-wave>

      <button v-else
              class="flag iconfont icon-more"
              plain
              hover-class="hover"
              @click.stop="onMore">
      </button>

    </view>
  </view>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import types from "@/store/mutations-types";

import UniSoundWave from "@/components/soundWave/UniSoundWave";

export default {
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      }
    },
    playlistId: {
      type: String
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UniSoundWave
  },
  data() {
    return {
      currentIndex: -1
    }
  },
  computed: {
    ...mapState({
      getIsInit: 'isInit',
      getAudio: 'audio',
      getIsPlay: 'isPlay',
      getCurrentSong: 'currentSong',
      getCurrentPlayQueue: 'currentPlayQueue',
      getRecentPlaySongs: 'recentPlaySongs',
    })
  },
  methods: {
    ...mapMutations([
        types.SET_IS_INIT,
        types.SET_SWITCH,
        types.SET_RESET_PAGE_INDEX,
        types.SET_CURRENT_PLAY_INDEX,
        types.SET_CURRENT_PLAY_QUEUE,
        types.SET_RECENT_PLAY_SONGS,
    ]),

    onPlay(item, index) {
      // 点击动画
      this.onAnim(index);

      // 点击menu进行选择时
      if (this.selectable) {
        this.onSelect(item, index);
        return
      }

      let curSong = this.getCurrentSong;
      // 第一次打开播放器
      if (!this.getIsInit) {
        this[types.SET_IS_INIT]();
      } else if (curSong && curSong.id === item.id){
        // 当前播放歌曲再来一遍
        this.getAudio.seek(0);
        console.log(`seek`);
        return;
      }

      let songs = this.songs,
          curPlayQueue = this.getCurrentPlayQueue,
          songsInfo = [],
          curPlId = this.playlistId;
      /*1. 歌单id不同直接获取歌单歌曲信息
      * 2. 歌单id相同但是因为加载了更多歌曲在次获取歌单歌曲信息 */
      // console.log(curSong.playlistId, curPlId, curPlayQueue.length, songs.length);

      if (!curSong || curSong.playlistId !== curPlId) {
        console.log(`歌单初次加载`);
        songsInfo = this.reload(songs, [], curPlId);
      } else if(curSong.playlistId === curPlId && curPlayQueue.length < songs.length) {
        console.log(`歌单加载更多`);
        songsInfo = curPlayQueue.concat(this.reload(songs, curPlayQueue, curPlId));
      } else {
        console.log(`默认加载`);
        // 获取歌曲链接
        this.$store.dispatch('getPlaySong', curPlayQueue[index]);
        // 重置playPage当前页面index
        this[types.SET_RESET_PAGE_INDEX](index);
        // 设置当前播放歌曲 index
        this[types.SET_CURRENT_PLAY_INDEX](index);
        return;
      }

      // 设置当前播放队列
      this[types.SET_CURRENT_PLAY_QUEUE](songsInfo);
      // 获取歌曲链接
      this.$store.dispatch('getPlaySong', songsInfo[index]);
      // 重置playPage当前页面index
      this[types.SET_RESET_PAGE_INDEX](index);
      // 设置当前播放歌曲 index
      this[types.SET_CURRENT_PLAY_INDEX](index);
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

    onAnim(index) {
      this.currentIndex = index;
      setTimeout(() => this.currentIndex = -1, 300);
    },

    onMore() {
      console.log(`more`);
    },

    onSelect(item) {
      item.isChecked = !item.isChecked;
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_song{
    .song_container{
      position: relative;
      z-index: 999;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 50rpx;
      .song_img{
        @include wh(140rpx, 140rpx);
        border-radius: 12rpx;
        margin-right: 40rpx;
        will-change: transform;
      }

      .song_detail{
        flex: .8;
        word-break: break-all;
        .song_name{
          color: $font-color-white;
          font-weight: bold;
          font-size: 38rpx;
        }
        .singer{
          color: $font-color-grey;
        }
      }

      .flag{
        font-size: 38rpx;
        color: $font-color-grey;
        border: none;
        border-radius: 50%;
        position: absolute;
        right: -2%;
      }
      .hover{
        @include hover();
      }

      .anim{
        @include wh(100%, 100%);
        background-color: rgba(128, 128, 128, .5);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        opacity: 0;
        transition: opacity .5s;
      }
      .clickAnim{
        opacity: 1;
      }
    }
  }
</style>