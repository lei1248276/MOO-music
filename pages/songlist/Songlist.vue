<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
  <!--  #endif  -->

    <scroll-view class="songlist"
                 scroll-y
                 lower-threshold="200"
                 @scrolltolower="onLoadMore"
                 @scroll="onScroll($event)">

      <uni-loading v-if="!isLoaded"></uni-loading>

      <uni-transition :mode-class="['fade']"
                      :show="isLoaded">
          <!--   导航后退按钮   -->
        <uni-back-nav>
          <button class="btn"
                  size="mini"
                  plain
                  hover-class="hover_send">
            <text class="iconfont icon-more"></text>
          </button>

          <text class="title"
                :class="[isShowTitle ? 'isShowTitle' : 'isHideTitle']">
            {{getSonglistDetails.name}}
          </text>

          <button class="btn"
                  size="mini"
                  plain
                  hover-class="hover_send">
            <text class="iconfont icon-send"></text>
          </button>
        </uni-back-nav>

        <!--   歌单详情信息   -->
        <view class="songlist_detail">
          <view class="songlist_pic">
            <prepare-img></prepare-img>
            <image :src="getSonglistDetails.picUrl + '?param=300y300'"
                   class="img"
                   lazy-load>
            </image>
            <text class="iconfont icon-music pos"></text>
          </view>

          <view class="creator">
            <view class="songlist_name">
              <view class="name">{{ getSonglistDetails.name }}</view>
              <button class="iconfont icon-heart"
                      plain
                      hover-class="hover_flag"
                      hover-stay-time="300"
                      @click.stop="onColPlaylist"
                      :class="[isCollect ? 'active' : '']">
              </button>
            </view>

            <view class="creator_info">
              <view class="creator_img">
                <image :src="getSonglistDetails.creatorImg + '?parma=50y50'"
                       class="pic" lazy-load>
                </image>
                <text class="nickname">{{ getSonglistDetails.creatorNickname }}</text>
              </view>
              <view class="description">{{ getSonglistDetails.description }}</view>
            </view>
          </view>
        </view>

        <uni-tag :tag="tag"></uni-tag>

        <!--   #ifndef MP-WEIXIN   -->
        <uni-song-control :count="tolLen"
                          @play="onPlay">
        </uni-song-control>
        <!--   #endif   -->

        <!--   #ifdef MP-WEIXIN   -->
        <uni-song-control :count="tolLen" v-if="tolLen"></uni-song-control>
        <!--   #endif   -->

        <view class="container">
          <uni-song ref="songs"
                    :songs="songs"
                    :playlistId="playlistId">
          </uni-song>
        </view>

        <uni-audio-controller @click.native="toPlayPage"></uni-audio-controller>
        <uni-mock-play-page v-if="isActive" :isShow.sync="isShowPlayPage"></uni-mock-play-page>

      </uni-transition>
    </scroll-view>
    <!-- #ifdef H5 -->
  </uni-transition>
    <!--  #endif  -->
</template>

<script>
import {throttle} from '@/util/index';
import {getPlaylist, getSongs} from "@/network/index";
import {mapState, mapMutations} from "vuex";
import types from "@/store/mutations-types";

import UniBackNav from "@/components/backNav/UniBackNav";
import UniSong from "@/components/song/UniSong";
import UniSongControl from "@/components/songControl/UniSongControl";
import UniTag from "@/components/tag/UniTag";

export default {
  data() {
    return {
      isLoaded: false,
      playlistId: '',
      tag: ['#一个人的夜', '#让我缓缓', '#躺着听'],
      songs: [],
      tolLen: 0,
      limit: 15,
      isShowTitle: false,
      isShowPlayPage: false,
      isActive: false
    }
  },
  components: {
    UniBackNav,
    UniSong,
    UniTag,
    UniSongControl
  },
  onLoad({id}) {
    // 保存播放列表id
    this.playlistId = id;
    // 生成一个临时播放歌曲队列做懒加载
    this.tempSongQueue = [];

    getPlaylist(id).then(res => {
      const [err, data] = res;
      // 获取所有歌曲查询id
      return this.getIds(data.data.playlist.trackIds.slice(0, 100));
    }).then(ids => {
      getSongs(ids).then(res => {
        let [err, data] = res;
        // 将所有请求到的歌曲放入临时队列
        this.tempSongQueue = data.data.songs.map(val => ({
          id: val.id,
          picUrl: val.al.picUrl,
          name: val.name,
          singer: val.ar[0].name
        }));

        this.tolLen = this.tempSongQueue.length;
        // 获取当前要渲染的歌曲（延迟加载）
        this.songs = Object.seal(this.getRenderSongs(0, this.limit))
        this.isLoaded = true;
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    })
  },
  mounted() {
    if (this.getColPlaylists[this.playlistId]) {
      this.getSonglistDetails.isCollect = true;
    }
  },
  onBackPress() {
    if (this.isShowPlayPage) {
      this.isShowPlayPage = false;
      return true;
    }
  },
  computed: {
    ...mapState({
      getSonglistDetails: 'songlistDetails',
      getColPlaylists: 'colPlaylists'
    }),

    isCollect() {
      return this.getSonglistDetails.isCollect;
    },
  },
  methods: {
    ...mapMutations([
       types.SET_COL_PLAYLISTS
    ]),

    onPlay() {
      this.$refs.songs.onPlay(this.songs[0], 0);
    },

    onColPlaylist() {
      this.getSonglistDetails.isCollect = !this.getSonglistDetails.isCollect;
      this.getSonglistDetails.songCount = this.tolLen;
      this[types.SET_COL_PLAYLISTS](this.getSonglistDetails);
    },

    onLoadMore() {
      const songs = this.songs;
      if (songs.length === this.tolLen) return;
      this.songs = Object.seal(songs.concat(this.getRenderSongs(songs.length, this.limit)));
    },

    onScroll: throttle(function (e) {
      this.isShowTitle = e.target.scrollTop > 250;
    }, 50),

    getIds(trackIds) {
      let len = trackIds.length,
          ids = '';
      for (let i = 0; i < len; i++) {
        ids += `,${trackIds[i].id}`;
      }
      return ids.substring(1);
    },

    getRenderSongs(offset, limit) {
      return this.tempSongQueue.slice(offset, limit + offset);
    },

    toPlayPage() {
      this.isShowPlayPage = this.isActive = true;
    }
  }
}
</script>

<style scoped lang="scss">
  .songlist{
    position: relative;
    height: 100vh;
    background-color: $bgc-black2;

    .container{
      width: 90%;
      margin: 0 50rpx;
      padding-bottom: 150rpx;
    }

    .btn{
      @include wh(120rpx, 120rpx);
      border: none;
      border-radius: 50%;
      float: right;
      margin: 80rpx 0;
      .icon-send, .icon-more{
         color: $font-color-white;
         font-size: 50rpx;
         font-weight: bold;
       }
    }

    .title{
      @include wh(45%, 50rpx);
      position: absolute;
      /* #ifndef APP-PLUS */
      bottom: 15%;
      /* #endif */
      /* #ifdef APP-PLUS */
      bottom: 28%;
      /* #endif */
      left: 45%;
      transform: translateX(-45%);
      color: $font-color-white;
      font-size: 38rpx;
      font-weight: bold;
      @include omit();
      transition: opacity .5s ease;
    }
    .isShowTitle{
      opacity: 1
    }
    .isHideTitle{
      opacity: 0;
    }

    .hover_send{
      @include hover();
    }

    .songlist_detail{
      width: 100%;
      .songlist_pic{
        @include wh(66%, 450rpx);
        position: relative;
        margin: 260rpx auto 50rpx;
        .img{
          @include wh(100%, 100%);
          border-radius: 20rpx;
          position: relative;
          z-index: 1;
        }
        .icon-music{
          @include wh(54rpx, 54rpx);
          text-align: center;
          font-size: 42rpx;
          border-radius: 50%;
          background-color: #f1f1f1;
          color: #666;
        }
        .pos{
          position: absolute;
          right: 3%;
          bottom: 3%;
        }
      }
      .creator{
        width: 90%;
        margin: 0 auto;

        .songlist_name{
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20rpx;
          .name{
            width: 85%;
            color: $font-color-white;
            font-size: 42rpx;
            font-weight: bold;
          }
          .icon-heart{
            height: 100rpx;
            position: absolute;
            right: 10rpx;
            border: none;
            font-size: $icon-size;
            border-radius: 50%;
          }
          .hover_flag{
            @include hover();
          }
          .active{
            transition: all .5s;
            color: $bgc-collection;
          }
        }

        .creator_info{
          width: 100%;

          .creator_img{
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;
            .pic{
              @include wh(80rpx, 80rpx);
              border-radius: 50%;
              margin-right: 16rpx;
            }
            .nickname{
              color: $font-color-grey;
              font-size: 34rpx;
            }
          }

          .description{
            color: $font-color-grey;
            font-size: 34rpx;
            margin-bottom: 20rpx;
          }
        }
      }
    }
  }
</style>