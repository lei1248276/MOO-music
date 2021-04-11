<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
  <!--  #endif  -->
    <view class="recent_play">

      <uni-back-nav title="最近播放"></uni-back-nav>

      <uni-tab-control :tab="tab" @tabControl="onTabControl"></uni-tab-control>

      <scroll-view class="scroll"
                   :style="{'transform': 'translate3d(' + currentIndex * 100 + 'vw, 0, 0)'}"
                   scroll-y>

        <uni-tab-view :viewIndex="0">
          <uni-alt v-if="!getRecentPlaySongs.length"></uni-alt>
          <uni-transition :mode-class="['fade']"
                          :show="getRecentPlaySongs.length > 0">
            <uni-song-control :count="getRecentPlaySongs.length"></uni-song-control>
            <uni-song class="view_item"
                      :songs="getRecentPlaySongs"
                      playlistId="recent">
            </uni-song>
          </uni-transition>
        </uni-tab-view>

        <uni-tab-view :viewIndex="1">
          <uni-alt></uni-alt>
        </uni-tab-view>

        <uni-tab-view :viewIndex="2">
          <uni-alt></uni-alt>
        </uni-tab-view>

      </scroll-view>

      <uni-audio-controller @click.native="toPlayPage"></uni-audio-controller>
      <uni-mock-play-page v-if="isActive" :isShow.sync="isShowPlayPage"></uni-mock-play-page>

    </view>
  <!-- #ifdef H5 -->
  </uni-transition>
  <!--  #endif  -->
</template>

<script>
import UniBackNav from "@/components/backNav/UniBackNav";
import UniTabControl from "@/components/tabControl/UniTabControl";
import UniSongControl from "@/components/songControl/UniSongControl";
import UniTabView from "@/components/tabView/UniTabView";
import UniSong from "@/components/song/UniSong";

export default {
  components: {
    UniBackNav,
    UniTabControl,
    UniSongControl,
    UniTabView,
    UniSong,
  },
  data() {
    return {
      tab: ['歌曲', '专辑', '歌单'],
      currentIndex: 0,
      isShowPlayPage: false,
      getRecentPlaySongs: [],
      isActive: false
    }
  },
  onBackPress() {
    if (this.isShowPlayPage) {
      this.isShowPlayPage = false;
      return true;
    }
  },
  created() {
    // 为了解决闪屏问题
    setTimeout(() => {
      this.getRecentPlaySongs = this.$store.state.recentPlaySongs;
    }, 200);
  },
  methods: {
    onTabControl(index) {
      this.currentIndex = -index;
    },

    toPlayPage() {
      this.isShowPlayPage = this.isActive = true;
    }
  }
}
</script>

<style scoped lang="scss">
  .recent_play{
    position: relative;
    height: 100vh;
    overflow: hidden;

    .scroll{
      width: 300vw;
      height: 100%;
      position: absolute;
      top: 14%;
      background-color: $bgc-black2;
      transition: all .1s ease-in-out;

      .view_item{
        width: 90%;
        margin: 0 50rpx;
        padding-bottom: 320rpx;
      }
    }
  }
</style>