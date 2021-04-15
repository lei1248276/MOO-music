<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
  <!--  #endif  -->
    <scroll-view class="playlist"
                 scroll-y
                 lower-threshold="200"
                 @scrolltolower="onLoadMore">

      <uni-loading v-if="!isLoaded"></uni-loading>

      <uni-transition :mode-class="['fade']" :show="isLoaded">
        <uni-back-nav></uni-back-nav>

        <view class="playlist_item">
          <view v-for="(item, index) in playlists" :key="index">
            <view class="item_title">{{ item[0].updateTime | time }}</view>
            <uni-playlist :playlists="item"></uni-playlist>
          </view>
        </view>

        <uni-audio-controller v-if="!isShowPlayPage"
                              @click.native="toPlayPage">
        </uni-audio-controller>
        <uni-mock-play-page :isShow.sync="isShowPlayPage"></uni-mock-play-page>

      </uni-transition>

    </scroll-view>
  <!-- #ifdef H5 -->
  </uni-transition>
  <!--  #endif  -->
</template>

<script>
import {getPlaylistAll} from "@/network/index";
import {dividePlaylist} from "@/util/index";

import UniPlaylist from "@/components/playlist/UniPlaylist";
import UniBackNav from "@/components/backNav/UniBackNav";


export default {
  components: {
    UniPlaylist,
    UniBackNav
  },
  data() {
    return {
      offset: -30,
      limit: 45,
      isShowPlayPage: false,
      playlists: [],
      isLoaded: false,
    }
  },
  onBackPress() {
    if (this.isShowPlayPage) {
      this.isShowPlayPage = false;
      return true;
    }
  },
  onLoad() {
    /*let t = Date.now()
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptPlaylists', data => {
      this.playlists = Object.seal(data);
      console.log(Date.now() - t);
    });*/

    // 为了解决闪屏问题增加延迟
    setTimeout(() => {
      this.playlists = this.$store.state.playlists;
      this.isLoaded = true;
    }, 200);
  },
  methods: {
    onLoadMore() {
      const limit = this.limit;
      let offset = this.offset += limit;
      getPlaylistAll(offset, limit).then(res => {
        const [err, data] = res,
            pl = data.data.playlists;
        this.playlists = this.playlists.concat(dividePlaylist(pl));
      }).catch(err => {
        console.log(err);
      })
    },

    toPlayPage() {
      this.isShowPlayPage = true;

    }
  },
  filters: {
    time(t) {
      t = new Date(t);
      let y = t.getFullYear() + '',
          m = t.getMonth() + 1 + '',
          d = t.getDate() + '';
      m = m.length === 1 ? '0' + m : m;
      d = d.length === 1 ? '0' + d : d;
      return y + m + d;
    }
  }
}
</script>

<style scoped lang="scss">
  .playlist{
    position: relative;
    height: 100vh;
    background-color: $bgc-black2;

    .playlist_item{
      position: absolute;
      top: 12%;

      .item_title{
        color: $font-color-white;
        font-size: 40rpx;
        font-weight: bold;
        margin: 30rpx;
      }
    }

    .trans{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1001;
    }
  }
</style>