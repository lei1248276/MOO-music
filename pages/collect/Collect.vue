<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
    <!--  #endif  -->
    <view class="collect">
      <uni-back-nav title="收藏"></uni-back-nav>

      <!--   tab选项栏   -->
      <uni-tab-control :tab="tab" @tabControl="onTabControl"></uni-tab-control>

      <scroll-view class="scroll"
                   :style="{'transform': 'translate3d(' + currentIndex * 100 + 'vw, 0, 0)'}"
                   scroll-y>

        <!--    tab对应显示的视图 1    -->
        <uni-tab-view :viewIndex="0">

          <uni-alt v-if="!getColSongs.length"></uni-alt>

          <uni-transition :mode-class="['fade']"
                          :show="getColSongs.length > 0"
                          class="view">
            <!--    歌曲选项控制    -->
            <uni-song-control v-show="isShowSongControl"
                              :count="getColSongs.length"
                              @menu="onMenu">
            </uni-song-control>

            <!--    点击songControl后显示的selectControl    -->
            <view v-show="!isShowSongControl" class="select_control">
              <view @click="onSelectAll">{{selectAll ? '全不选' : '全选'}}</view>
              <view @click="onComplete">完成</view>
            </view>

            <uni-song class="view_item"
                      :songs="getColSongs"
                      playlistId="collect"
                      :selectable="!isShowSongControl">
            </uni-song>
          </uni-transition>
        </uni-tab-view>

        <!--    tab对应显示的视图 2    -->
        <uni-tab-view :viewIndex="1">
          <uni-alt></uni-alt>
        </uni-tab-view>

        <!--    tab对应显示的视图 3    -->
        <uni-tab-view :viewIndex="2">
          <uni-alt></uni-alt>
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
import UniSongControl from "@/components/songControl/UniSongControl";
import UniTabView from "@/components/tabView/UniTabView";
import UniSong from "@/components/song/UniSong";

import {mapMutations} from "vuex";
import types from "@/store/mutations-types";

export default {
  components: {
    UniBackNav,
    UniTabControl,
    UniTabView,
    UniSongControl,
    UniSong
  },
  data() {
    return {
      tab: ['歌曲', '艺人', '专辑'],
      currentIndex: 0,
      isShowPlayPage: false,
      isShowSongControl: true,
      selectAll: false,
      getColSongs: [],
      isActive: false
    }
  },
  onBackPress() {
    if (this.isShowPlayPage) {
      this.isMove = this.isReach = this.isShowPlayPage = false;
      return true;
    }
  },
  created() {
    // 为了解决闪屏问题
    setTimeout(() => {
      this.getColSongs = Object.values(this.$store.state.colSongs).reverse();
    }, 200);
  },
  methods: {
    ...mapMutations([
       types.SET_COL_SONGS
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
      this.getColSongs.forEach(item => {
        item.isChecked = !bool;
      })
    },

    onComplete() {
      this.isShowSongControl = true;
      this.selectAll = false;
      this.getColSongs.forEach(item => {
        item.isChecked = false;
      })
    },

    onTrash() {
      let deleteList = [];
      this.getColSongs = this.getColSongs.filter(item => {
        if (item.isChecked) deleteList.push(item.id);
        return !item.isChecked
      })
      this[types.SET_COL_SONGS](deleteList);
      this.isShowSongControl = true;
      this.selectAll = false;
    }
  }
}
</script>

<style scoped lang="scss">
  .collect{
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

        .view_item{
          width: 90%;
          margin: 0 50rpx;
          padding-bottom: 320rpx;
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