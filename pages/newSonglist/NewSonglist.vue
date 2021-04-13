<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
    <!--  #endif  -->
    <scroll-view class="new_songlist"
                 scroll-y
                 @scroll="onScroll($event)">

      <uni-back-nav class="nav" :class="[isShowNav ? '' : 'nav_text_hide']">
        <view class="nav_text" :class="[isShowNav ? 'nav_text_hide' : '']">MOO Track 新歌</view>
      </uni-back-nav>

      <view class="title" :class="[isShowTitle ? '' : 'title_hide']">
        <view class="text">MOO</view>
        <view class="text">TRACK</view>
        <view class="comment">
          <view class="date">03/25</view>
          <view class="moo">MOO Track 新歌</view>
        </view>
      </view>

      <!--   #ifndef MP-WEIXIN   -->
      <uni-song-control :count="getNewSonglist.length"></uni-song-control>
      <!--   #endif   -->

      <!--   #ifdef MP-WEIXIN   -->
      <uni-song-control :count="getNewSonglist.length" v-if="getNewSonglist.length"></uni-song-control>
      <!--   #endif   -->

      <uni-transition class="container"
                      :mode-class="['fade']"
                      :show="getNewSonglist.length > 0">
          <uni-song :songs="getNewSonglist"
                    :playlistId="playlistId">
          </uni-song>
      </uni-transition>

      <uni-audio-controller @click.native="toPlayPage"></uni-audio-controller>
      <uni-mock-play-page v-if="isActive" :isShow.sync="isShowPlayPage"></uni-mock-play-page>

    </scroll-view>
  <!-- #ifdef H5 -->
  </uni-transition>
  <!--  #endif  -->
</template>

<script>
import {throttle} from "@/util/index";

import UniBackNav from "@/components/backNav/UniBackNav";
import UniSong from "@/components/song/UniSong";
import UniSongControl from "@/components/songControl/UniSongControl";

export default {
  data() {
    return {
      isShowNav: true,
      isShowTitle: true,
      playlistId: '',
      getNewSonglist: [],
      isShowPlayPage: false,
      isActive: false
    }
  },
  components: {
    UniBackNav,
    UniSong,
    UniSongControl
  },
  onLoad({id}) {
    this.playlistId = id;

    // eventChannel在app端有400多ms延迟.....
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptNewSonglist', data => {
      this.getNewSonglist = data;
    });
  },
  onBackPress() {
    if (this.isShowPlayPage) {
      this.isShowPlayPage = false;
      return true;
    }
  },
  /*computed: {
    getNewSonglist() {
      return this.$store.state.newSonglist.slice(0, 15);
    }
  },*/
  methods: {
    onScroll: throttle(function (e) {
      const top = e.target.scrollTop;
      this.isShowTitle = top < 50;
      this.isShowNav = top < 100;
    }, 50),

    onClick() {
      let audio = this.$store.state.audio,
          duration = audio.duration;
      audio.seek(duration - 5);
    },

    toPlayPage() {
      this.isShowPlayPage = this.isActive = true;
    }
  }
}
</script>

<style scoped lang="scss">
  .new_songlist{
    position: relative;
    height: 100vh;
    background-color: $bgc-black2;

    .container{
      width: 90%;
      margin: 0 50rpx;
      padding-bottom: 150rpx;
    }

    .nav{
      transition: all .5s;
      background-color: transparent;
      .nav_text{
        color: $font-color-white;
        font-size: 36rpx;
        font-weight: bold;
        position: absolute;
        /* #ifndef APP-PLUS */
        bottom: 15%;
        /* #endif */
        /* #ifdef APP-PLUS */
        bottom: 28%;
        /* #endif */
        left: 50%;
        transform: translateX(-50%);
        transition: all .5s;
      }
      .nav_text_hide{
        opacity: 0;
      }
    }
    .nav_text_hide{
      background-color: $bgc-black2;
    }

    .title{
      @include wh(100%, 340rpx);
      padding-top: 80rpx;
      margin-bottom: 50rpx;
      background-color: $bgc-black1;
      display: flex;
      flex-wrap: wrap;
      transition: opacity .5s;
      .text{
        @include wh(100%, 170rpx);
        line-height: 170rpx;
        transform: scale(1.2, 1);
        color: rgb(49, 47, 49);
        font-weight: bold;
        font-size: 184rpx;
        text-indent: 60rpx;
      }
      .comment{
        position: absolute;
        top: 17%;
        left: 5%;
        font-weight: bold;
        color: $font-color-white;
        .date{
          font-size: 38rpx;
        }
        .moo{
          font-size: 52rpx;
        }
      }
    }
    .title_hide{
      opacity: 0;
    }
  }
</style>