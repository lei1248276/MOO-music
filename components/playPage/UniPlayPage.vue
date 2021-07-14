<<<<<<< HEAD
<template>
  <view class="uni_play_page">
    <swiper v-if="getCurrentSong"
            class="swiper"
            vertical
            circular
            duration="200"
            @change="onChange"
            :current="getShowPageIndex"
            :class="[isShowSongQueue ? 'blur' : '']">

      <swiper-item
                   class="item"
                   @click="onMask"
                   v-for="(item, index) in renderQueue"
                   :key="index">

        <image :src="item.picUrl + '?param=400y700'"
               class="img mask"
               :class="[(!getIsPlay && getShowPageIndex === index) && 'pause iconfont icon-audioPlay']">
        </image>

        <uni-lyric v-if="getShowPageIndex === index && getCurrentSong"></uni-lyric>

        <!--    配用图片背景    -->
        <prepare-img v-if="renderQueue.length > 0"
                     :fz="22">
        </prepare-img>

        <view class="song_info"
              v-if="getCurrentSong">
          <uni-tag :tag="tag"></uni-tag>
          <view class="song_detail">
            <view class="info">
              <view class="name">{{ item.name }}</view>
              <view class="singer">{{ item.singer }}</view>
            </view>
            <view class="control">
              <view class="iconfont icon-heart"
                    @click.stop="onColSongs(item)"
                    :class="[item.isCollect ? 'active' : '']"></view>
              <view class="iconfont icon-more"
                    @click.stop="onShowSongQueue">
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!--  歌曲播放队列  -->
    <uni-song-queue v-if="isActive"
                    :isShow.sync="isShowSongQueue">
    </uni-song-queue>

    <!--  soundWave  -->
    <uni-super-sound-wave v-show="!isShowSongQueue"
                          :run="getIsPlay">
    </uni-super-sound-wave>
  </view>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import types from "@/store/mutations-types";

import UniTag from "../tag/UniTag";
import UniSongQueue from "../songQueue/UniSongQueue";
import UniSuperSoundWave from "../superSoundWave/UniSuperSoundWave";
import UniLyric from "../lyric/UniLyric";

export default {
  components: {
    UniTag,
    UniSongQueue,
    UniSuperSoundWave,
    UniLyric
  },
  data() {
    return {
      tag: ['+歌曲故事', '#New Wave', '#Hot', '#Moo Daily'],
      isShowSongQueue: false,
      isActive: false,
      i: 0
    }
  },
  computed: {
    ...mapState({
      getIsInit: 'isInit',
      getIsPlay: 'isPlay',
      getAudio: 'audio',
      getCurrentSong: 'currentSong',
      getShowPageIndex: 'showPageIndex',
      getCurrentPlayIndex: 'currentPlayIndex',
      getTopPageIndex: 'topPageIndex',
      getMiddlePageIndex: 'middlePageIndex',
      getBottomPageIndex: 'bottomPageIndex',
      getCurrentPlayQueue: state => {
        state.currentPlayQueue.forEach(v => {
          if (state.colSongs[v.id] != null) v.isCollect = true;
        });
        return state.currentPlayQueue;
      },
      getLock: 'lock',
      getColSongs: 'colSongs'
    }),

    renderQueue() {
      const queue = this.getCurrentPlayQueue;
      if (queue.length < 3) return queue;
      return [
          queue[this.getTopPageIndex],
          queue[this.getMiddlePageIndex],
          queue[this.getBottomPageIndex]
      ];
    },

  },
  methods: {
    ...mapMutations([
        types.SET_SHOW_PAGE_INDEX,
        types.SET_CURRENT_PLAY_INDEX,
        types.SET_TOP_PAGE_INDEX,
        types.SET_MIDDLE_PAGE_INDEX,
        types.SET_BOTTOM_PAGE_INDEX,
        types.SET_IS_INIT,
        types.SET_COL_SONGS,
    ]),

    onMask() {
      if (this.getIsPlay) {
        this.getAudio.pause();
      } else{
        // 如果是app初始化时点击就发出请求
        if (!this.getIsInit) {
          this[types.SET_IS_INIT]();
          this.$store.dispatch('getPlaySong', this.getCurrentSong);
          return;
        }
        this.getAudio.play()
      }
    },

    onChange(e) {
      if (this.getLock)return;
      this[types.SET_SHOW_PAGE_INDEX](e.detail.current);
      // console.log(`change`);
    },

    onColSongs(item) {
      item.isCollect = !item.isCollect;
      this[types.SET_COL_SONGS](item);
    },

    onShowSongQueue() {
      this.isShowSongQueue = this.isActive = true;
    },
  },
  watch: {
    // 动态加载播放页面
    getShowPageIndex(val, oldVal) {
      // 避免多次触发函数，执行完毕后会发出网络请求直到请求结束才会解锁
      if (this.getLock)return;

      let playIndex = this.getCurrentPlayIndex;
      const last = this.getCurrentPlayQueue.length - 1;
      // 特殊情况（播放列表歌曲少于两首时）
      if (last <= 2) {
        // 切歌后发出请求歌曲 url
        this.$store.dispatch('getPlaySong', this.getCurrentPlayQueue[val]);
        // 修改当前播放队列歌曲 index
        this[types.SET_CURRENT_PLAY_INDEX](val);
        return;
      }

      // 滑动窗口变化的6种情况，动态改变指针（保证初始化时只渲染 3页，而每次切歌只重绘 1页）
      if (oldVal === 1 && val === 2) {
        // console.log(oldVal, val, `下一曲`, playIndex);
        playIndex = playIndex === last ? 0 : playIndex + 1;
        this[types.SET_TOP_PAGE_INDEX](playIndex === last ? 0 : playIndex + 1);

      } else if (oldVal === 2 && val === 0) {
        // console.log(oldVal, val, `下一曲`, playIndex);
        playIndex = playIndex === last ? 0 : playIndex + 1;
        this[types.SET_MIDDLE_PAGE_INDEX](playIndex === last ? 0 : playIndex + 1);

      } else if (oldVal === 0 && val === 1) {
        // console.log(oldVal, val, `下一曲`, playIndex);
        playIndex = playIndex === last ? 0 : playIndex + 1;
        this[types.SET_BOTTOM_PAGE_INDEX](playIndex === last ? 0 : playIndex + 1);

      } else if (oldVal === 1 && val === 0) {
        // console.log(oldVal, val, `上一曲`, playIndex);
        playIndex = playIndex === 0 ? last : playIndex - 1;
        this[types.SET_BOTTOM_PAGE_INDEX](playIndex === 0 ? last : playIndex - 1);

      } else if (oldVal === 0 && val === 2) {
        // console.log(oldVal, val, `上一曲`, playIndex);
        playIndex = playIndex === 0 ? last : playIndex - 1;
        this[types.SET_MIDDLE_PAGE_INDEX](playIndex === 0 ? last : playIndex - 1);

      } else if (oldVal === 2 && val === 1) {
        // console.log(oldVal, val, `上一曲`, playIndex);
        playIndex = playIndex === 0 ? last : playIndex - 1;
        this[types.SET_TOP_PAGE_INDEX](playIndex === 0 ? last : playIndex - 1);
      }
      // console.log(playIndex);
      // 切歌后发出请求歌曲 url
      this.$store.dispatch('getPlaySong', this.getCurrentPlayQueue[playIndex]);
      // 修改当前播放队列歌曲 index
      this[types.SET_CURRENT_PLAY_INDEX](playIndex);
    },
  }
}
</script>

<style scoped lang="scss">
  .uni_play_page{
    @include wh(100%, 100%);
    position: relative;

    .blur{
      filter: blur(15px);
    }
    .swiper{
      @include wh(100%, 100%);
      position: absolute;
      top: 0;
      left: 0;

      .item{
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%, 100%);

        .img{
          @include wh(100%, 100%);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          will-change: transform;
		      object-fit: cover;
        }

        .song_info{
          @include wh(90%, 25%);
          position: absolute;
          z-index: 2;
          bottom: 18%;
          left: 50%;
          transform: translate3d(-50%, -10%, 0);

          .song_detail{
            width: $container-size;
            margin: 0 auto;
            height: 65%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            color: $font-color-white;
            .info{
              flex: 2.5;
              .name{
                font-size: 48rpx;
                font-weight: bold;
              }
              .singer{
                font-size: 38rpx;
                margin-top: 20rpx;
              }
            }
            .control {
              flex: 1;
              text-align: center;
              .iconfont {
                font-size: $icon-size;
              }
              .icon-more{
                margin-top: 20rpx;
              }
              .active{
                color: $bgc-collection;
              }
            }
          }
        }
      }
    }
  }

  .mask::after{
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 999;
  }
  .pause::before{
    content: "\e734";
    color: $font-color-white;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    transform: translate3d(-50%, -50%, 0);
    font-size: 100rpx;
  }
</style>
=======
<template>
  <view class="uni_play_page">
    <swiper v-if="getCurrentSong"
            class="swiper"
            vertical
            circular
            duration="200"
            @change="onChange"
            :current="getShowPageIndex"
            :class="[isShowSongQueue ? 'blur' : '']">

      <swiper-item
                   class="item"
                   @click="onMask"
                   v-for="(item, index) in renderQueue"
                   :key="index">

        <image :src="item.picUrl + '?param=400y700'"
               class="img mask"
               :class="[(!getIsPlay && getShowPageIndex === index) && 'pause iconfont icon-audioPlay']">
        </image>

        <uni-lyric v-if="getShowPageIndex === index && getCurrentSong"></uni-lyric>

        <!--    配用图片背景    -->
        <prepare-img v-if="renderQueue.length > 0"
                     :fz="22">
        </prepare-img>

        <view class="song_info"
              v-if="getCurrentSong">
          <uni-tag :tag="tag"></uni-tag>
          <view class="song_detail">
            <view class="info">
              <view class="name">{{ item.name }}</view>
              <view class="singer">{{ item.singer }}</view>
            </view>
            <view class="control">
              <view class="iconfont icon-heart"
                    @click.stop="onColSongs(item)"
                    :class="[item.isCollect ? 'active' : '']"></view>
              <view class="iconfont icon-more"
                    @click.stop="onShowSongQueue">
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!--  歌曲播放队列  -->
    <uni-song-queue v-if="isActive"
                    :isShow.sync="isShowSongQueue">
    </uni-song-queue>

    <!--  soundWave  -->
    <uni-super-sound-wave v-show="!isShowSongQueue"
                          :run="getIsPlay">
    </uni-super-sound-wave>
  </view>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import types from "@/store/mutations-types";

import UniTag from "../tag/UniTag";
import UniSongQueue from "../songQueue/UniSongQueue";
import UniSuperSoundWave from "../superSoundWave/UniSuperSoundWave";
import UniLyric from "../lyric/UniLyric";

export default {
  components: {
    UniTag,
    UniSongQueue,
    UniSuperSoundWave,
    UniLyric
  },
  data() {
    return {
      tag: ['+歌曲故事', '#New Wave', '#Hot', '#Moo Daily'],
      isShowSongQueue: false,
      isActive: false,
      i: 0
    }
  },
  computed: {
    ...mapState({
      getIsInit: 'isInit',
      getIsPlay: 'isPlay',
      getAudio: 'audio',
      getCurrentSong: 'currentSong',
      getShowPageIndex: 'showPageIndex',
      getCurrentPlayIndex: 'currentPlayIndex',
      getTopPageIndex: 'topPageIndex',
      getMiddlePageIndex: 'middlePageIndex',
      getBottomPageIndex: 'bottomPageIndex',
      getCurrentPlayQueue: state => {
        state.currentPlayQueue.forEach(v => {
          if (state.colSongs[v.id] != null) v.isCollect = true;
        });
        return state.currentPlayQueue;
      },
      getLock: 'lock',
      getColSongs: 'colSongs'
    }),

    renderQueue() {
      const queue = this.getCurrentPlayQueue;
      if (queue.length < 3) return queue;
      return [
          queue[this.getTopPageIndex],
          queue[this.getMiddlePageIndex],
          queue[this.getBottomPageIndex]
      ];
    },

  },
  methods: {
    ...mapMutations([
        types.SET_SHOW_PAGE_INDEX,
        types.SET_CURRENT_PLAY_INDEX,
        types.SET_TOP_PAGE_INDEX,
        types.SET_MIDDLE_PAGE_INDEX,
        types.SET_BOTTOM_PAGE_INDEX,
        types.SET_IS_INIT,
        types.SET_COL_SONGS,
    ]),

    onMask() {
      if (this.getIsPlay) {
        this.getAudio.pause();
      } else{
        // 如果是app初始化时点击就发出请求
        if (!this.getIsInit) {
          this[types.SET_IS_INIT]();
          this.$store.dispatch('getPlaySong', this.getCurrentSong);
          return;
        }
        this.getAudio.play()
      }
    },

    onChange(e) {
      if (this.getLock)return;
      this[types.SET_SHOW_PAGE_INDEX](e.detail.current);
      // console.log(`change`);
    },

    onColSongs(item) {
      item.isCollect = !item.isCollect;
      this[types.SET_COL_SONGS](item);
    },

    onShowSongQueue() {
      this.isShowSongQueue = this.isActive = true;
    },
  },
  watch: {
    // 动态加载播放页面
    getShowPageIndex(val, oldVal) {
      // 避免多次触发函数，执行完毕后会发出网络请求直到请求结束才会解锁
      if (this.getLock)return;

      let playIndex = this.getCurrentPlayIndex;
      const last = this.getCurrentPlayQueue.length - 1;
      // 特殊情况（播放列表歌曲少于两首时）
      if (last <= 2) {
        // 切歌后发出请求歌曲 url
        this.$store.dispatch('getPlaySong', this.getCurrentPlayQueue[val]);
        // 修改当前播放队列歌曲 index
        this[types.SET_CURRENT_PLAY_INDEX](val);
        return;
      }

      // 滑动窗口变化的6种情况，动态改变指针（保证初始化时只渲染 3页，而每次切歌只重绘 1页）
      if (oldVal === 1 && val === 2) {
        // console.log(oldVal, val, `下一曲`, playIndex);
        playIndex = playIndex === last ? 0 : playIndex + 1;
        this[types.SET_TOP_PAGE_INDEX](playIndex === last ? 0 : playIndex + 1);

      } else if (oldVal === 2 && val === 0) {
        // console.log(oldVal, val, `下一曲`, playIndex);
        playIndex = playIndex === last ? 0 : playIndex + 1;
        this[types.SET_MIDDLE_PAGE_INDEX](playIndex === last ? 0 : playIndex + 1);

      } else if (oldVal === 0 && val === 1) {
        // console.log(oldVal, val, `下一曲`, playIndex);
        playIndex = playIndex === last ? 0 : playIndex + 1;
        this[types.SET_BOTTOM_PAGE_INDEX](playIndex === last ? 0 : playIndex + 1);

      } else if (oldVal === 1 && val === 0) {
        // console.log(oldVal, val, `上一曲`, playIndex);
        playIndex = playIndex === 0 ? last : playIndex - 1;
        this[types.SET_BOTTOM_PAGE_INDEX](playIndex === 0 ? last : playIndex - 1);

      } else if (oldVal === 0 && val === 2) {
        // console.log(oldVal, val, `上一曲`, playIndex);
        playIndex = playIndex === 0 ? last : playIndex - 1;
        this[types.SET_MIDDLE_PAGE_INDEX](playIndex === 0 ? last : playIndex - 1);

      } else if (oldVal === 2 && val === 1) {
        // console.log(oldVal, val, `上一曲`, playIndex);
        playIndex = playIndex === 0 ? last : playIndex - 1;
        this[types.SET_TOP_PAGE_INDEX](playIndex === 0 ? last : playIndex - 1);
      }
      // console.log(playIndex);
      // 切歌后发出请求歌曲 url
      this.$store.dispatch('getPlaySong', this.getCurrentPlayQueue[playIndex]);
      // 修改当前播放队列歌曲 index
      this[types.SET_CURRENT_PLAY_INDEX](playIndex);
    },
  }
}
</script>

<style scoped lang="scss">
  .uni_play_page{
    @include wh(100%, 100%);
    position: relative;

    .blur{
      filter: blur(15px);
    }
    .swiper{
      @include wh(100%, 100%);
      position: absolute;
      top: 0;
      left: 0;

      .item{
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%, 100%);

        .img{
          @include wh(100%, 100%);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          will-change: transform;
		      object-fit: cover;
        }

        .song_info{
          @include wh(90%, 25%);
          position: absolute;
          z-index: 2;
          bottom: 18%;
          left: 50%;
          transform: translate3d(-50%, -10%, 0);

          .song_detail{
            width: $container-size;
            margin: 0 auto;
            height: 65%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            color: $font-color-white;
            .info{
              flex: 2.5;
              .name{
                font-size: 48rpx;
                font-weight: bold;
              }
              .singer{
                font-size: 38rpx;
                margin-top: 20rpx;
              }
            }
            .control {
              flex: 1;
              text-align: center;
              .iconfont {
                font-size: $icon-size;
              }
              .icon-more{
                margin-top: 20rpx;
              }
              .active{
                color: $bgc-collection;
              }
            }
          }
        }
      }
    }
  }

  .mask::after{
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 999;
  }
  .pause::before{
    content: "\e734";
    color: $font-color-white;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    transform: translate3d(-50%, -50%, 0);
    font-size: 100rpx;
  }
</style>
>>>>>>> 0a262098dafa87636509473e53b05d55aa5b01d6
