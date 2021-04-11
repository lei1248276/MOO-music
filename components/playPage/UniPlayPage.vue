<template>
  <view class="uni_play_page">
    <swiper class="swiper"
            vertical
            circular
            duration="200"
            @change="onChange"
            :current="getPlayPageIndex"
            :class="[isShowSongQueue ? 'blur' : '']">

      <swiper-item class="item"
                   @click="onMask"
                   v-for="(item, index) in getCurrentPlayQueue"
                   :key="index">

        <!--  图片懒加载：优先加载，当前图片、上一张图片（或是最后一张图片）、下一张图片（或是第一张图片） -->
        <image v-if="getPlayPageIndex === index
            || getPlayPageIndex === index - 1
            || getPlayPageIndex - 1 === index
            || !index
            || index === getCurrentPlayQueue.length - 1"
               :src="item.picUrl + '?param=400y400'"
               class="img" mode="aspectFill"
               :class="[(!getIsPlay && getPlayPageIndex === index) && 'mask iconfont icon-audioPlay']">
        </image>

        <prepare-img :fz="22"></prepare-img>

        <view class="song_info" v-if="getCurrentSong">
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
    <uni-song-queue v-if="isActive" :isShow.sync="isShowSongQueue"></uni-song-queue>

  </view>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import types from "@/store/mutations-types";

import UniTag from "../tag/UniTag";
import UniSongQueue from "../songQueue/UniSongQueue";

export default {
  components: {
    UniTag,
    UniSongQueue
  },
  data() {
    return {
      tag: ['+歌曲故事', '#New Wave', '#Hot', '#Moo Daily'],
      isShowSongQueue: false,
      isActive: false,
      // currentIndex: 0,
      // renderQueue: this.$store.state.currentPlayQueue.slice(0,this.$store.state.playPageIndex + 2)
    }
  },
  /*created() {
    this.currentIndex = this.getPlayPageIndex;
    this.getAudio.onCanplay(() => {
      console.log(`onCanplay`);
      this.setRenderQueue();
    })
  },*/
  computed: {
    ...mapState({
      getIsInit: 'isInit',
      getIsPlay: 'isPlay',
      getAudio: 'audio',
      getCurrentSong: 'currentSong',
      getPlayPageIndex: 'playPageIndex',
      getCurrentPlayQueue: state => {
        state.currentPlayQueue.forEach(v => {
          if (state.colSongs[v.id] != null) v.isCollect = true;
        });
        return state.currentPlayQueue;
      },
      getLock: 'lock',
      getColSongs: 'colSongs'
    }),
		
  },
  methods: {
    ...mapMutations([
        types.SET_PLAY_PAGE_INDEX,
        types.SET_IS_INIT,
        types.SET_COL_SONGS
    ]),

    // 动态加载播放页面
    /*setRenderQueue() {
      let index = this.getPlayPageIndex,
          queue = this.getCurrentPlayQueue,
          last = queue.length - 1;
      /!*if (index !== last && index + 2 < queue.length) {
        console.log(`.....`);
        this.renderQueue.push(...queue.slice(index, index + 1));
        console.log(this.renderQueue);
      }*!/
      this.renderQueue.push(...queue.slice(index, index + 1));
    },*/

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
      // 避免重复请求数据
      if (!this.getLock) {
        let current = e.detail.current;
        this.$store.dispatch('getPlaySong', this.getCurrentPlayQueue[current]);
        this[types.SET_PLAY_PAGE_INDEX](current);
      }
    },

    onColSongs(item) {
      item.isCollect = !item.isCollect;
      this[types.SET_COL_SONGS](item);
    },

    onShowSongQueue() {
      this.isShowSongQueue = this.isActive = true;
    },
  },
  /*watch: {
    getCurrentPlayQueue() {
      // this.setRenderQueue();
    }
  }*/
}
</script>

<style scoped lang="scss">
  .uni_play_page{
    @include wh(100%, 100%);
    position: relative;

    .blur{
      filter: blur(20px);
    }
    .swiper{
      @include wh(100%, 100%);
      position: absolute;

      .item{
        position: absolute;
        @include wh(100%, 100%);

        .img{
          @include wh(100%, 100%);
          will-change: transform;
        }

        .song_info{
          @include wh(90%, 25%);
          position: absolute;
          bottom: 10%;
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

    /*.songQueue{
      @include wh(100%, 100%);
      position: absolute;
      z-index: 1000;
      transition: all .5s ease;

      .icon-arrow{
        position: absolute;
        left: 50%;
        transform: translateX(-50%) rotate(90deg);
        color: $font-color-white;
      }

      .box{
        @include wh(100%, 100%);
        position: absolute;
        background-color: rgba(0, 0, 0, .2);

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
    }*/
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
  .mask::before{
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
