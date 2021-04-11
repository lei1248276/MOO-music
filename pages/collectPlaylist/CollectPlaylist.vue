<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
    <!--  #endif  -->
    <view class="collect_playlist">

      <uni-back-nav title="歌单"></uni-back-nav>

      <uni-tab-control :tab="tab" @tabControl="onTabControl"></uni-tab-control>

      <scroll-view class="scroll"
                   :style="{'transform': 'translate3d(' + currentIndex * 100 + 'vw, 0, 0)'}"
                   scroll-y>

        <uni-tab-view :viewIndex="0">
          <uni-alt></uni-alt>
        </uni-tab-view>

        <uni-tab-view :viewIndex="1">

          <uni-alt v-if="!getColPlaylists.length"></uni-alt>

          <uni-transition :mode-class="['fade']"
                          :show="getColPlaylists.length > 0"
                          class="view">
            <!--    歌曲选项控制    -->
            <uni-song-control v-show="isShowSongControl"
                              :count="getColPlaylists.length"
                              @menu="onMenu">
            </uni-song-control>

            <!--    点击songControl后显示的selectControl    -->
            <view v-show="!isShowSongControl" class="select_control">
              <view @click="onSelectAll">{{selectAll ? '全不选' : '全选'}}</view>
              <view @click="onComplete">完成</view>
            </view>

            <uni-col-playlist :playlist="getColPlaylists"
                              :selectable="!isShowSongControl">
            </uni-col-playlist>

          </uni-transition>
        </uni-tab-view>

      </scroll-view>

      <!--    selectControl显示后对应的确认栏    -->
      <view v-show="!isShowSongControl"
            class="select_confirm">
        <view class="iconfont icon-trash"
              @click="onTrash"></view>
      </view>

      <uni-audio-controller v-show="isShowSongControl"
                            @click.native="toPlayPage">
      </uni-audio-controller>
      <uni-mock-play-page v-if="isActive" :isShow.sync="isShowPlayPage"></uni-mock-play-page>

    </view>
    <!-- #ifdef H5 -->
  </uni-transition>
  <!--  #endif  -->
</template>

<script>
import UniBackNav from "@/components/backNav/UniBackNav";
import UniTabControl from "@/components/tabControl/UniTabControl";
import UniTabView from "@/components/tabView/UniTabView";
import UniSongControl from "@/components/songControl/UniSongControl";
import UniColPlaylist from "@/components/colPlaylist/UniColPlaylist";

import {mapMutations} from "vuex";
import types from "@/store/mutations-types";

export default {
  components: {
    UniBackNav,
    UniTabControl,
    UniTabView,
    UniSongControl,
    UniColPlaylist
  },
  data() {
    return {
      tab: ['自建', '收藏'],
      currentIndex: 0,
      isShowPlayPage: false,
      isShowSongControl: true,
      selectAll: false,
      getColPlaylists: [],
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
      this.getColPlaylists = Object.values(this.$store.state.colPlaylists).reverse();
    }, 200)
  },
  methods: {
    ...mapMutations([
      types.SET_COL_PLAYLISTS
    ]),

    onTabControl(index) {
      this.currentIndex = -index;
    },

    toPlayPage() {
      this.isShowPlayPage = this.isActive = true;
    },

    onMenu() {
      this.isShowSongControl = false;
    },

    onSelectAll() {
      let bool = this.selectAll;
      this.selectAll = !bool;
      this.getColPlaylists.forEach(item => {
        item.isChecked = !bool;
      })
    },

    onComplete() {
      this.isShowSongControl = true;
      this.selectAll = false;
      this.getColPlaylists.forEach(item => {
        item.isChecked = false;
      })
    },

    onTrash() {
      let deleteList = [];
      this.getColPlaylists = this.getColPlaylists.filter(item => {
        if (item.isChecked) deleteList.push(item.id);
        return !item.isChecked
      })
      this[types.SET_COL_PLAYLISTS](deleteList);
      this.isShowSongControl = true;
      this.selectAll = false;
    }
  }
}
</script>

<style scoped lang="scss">
  .collect_playlist{
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

      .view{
        overflow: hidden;

        .select_control{
          @include wh(85%, 100rpx);
          margin: 0 auto 50rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: $font-color-white;
          font-size: 38rpx;
        }
      }
    }

    .select_confirm{
      @include wh(100%, 100rpx);
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: $font-color-white;
      background-color: $bgc-black2;

      .icon-trash{
        font-size: $icon-size;
      }
    }
  }
</style>