<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
  <!--  #endif  -->
    <view>
      <scroll-view class="profile"
                   scroll-y
                   @touchstart.stop="onTouchstart"
                   @touchmove.stop="onTouchmove($event)"
                   @touchend.stop="onTouchend">

        <uni-back-nav>
          <text class="title">我的音乐</text>
          <button class="btn"
                  size="mini"
                  plain
                  hover-class="hover_set">
            <text class="iconfont icon-setting"></text>
          </button>
        </uni-back-nav>

        <view class="profile_info">
          <view class="detail">
            <text class="iconfont icon-user"></text>
            <text class="name">Jaye</text>
          </view>
          <view class="other">
            <view class="subscribe">
              <view class="text">关注
                <text class="count">0</text>
              </view>
              <view class="text">粉丝
                <text class="count">0</text>
              </view>
            </view>
            <view class="vip">
              <text class="text">免费VIP活动</text>
            </view>
          </view>
        </view>

        <uni-show-shelf :showData="showData"
                        class="player_info">
        </uni-show-shelf>

        <view class="message">
          <view class="item" v-for="(item, index) in message" :key="index">
            <view class="iconfont" :class="item.icon"></view>
            <view class="content">{{ item.text }}</view>
            <view class="iconfont icon-arrow"></view>
          </view>
        </view>

      </scroll-view>

      <uni-audio-controller @click.native="toPlayPage"></uni-audio-controller>
      <uni-mock-play-page v-if="isActive" :isShow.sync="isShowPlayPage"></uni-mock-play-page>
    </view>
  <!-- #ifdef H5 -->
  </uni-transition>
  <!--  #endif  -->
</template>

<script>
import {throttle} from '@/util/index'

import UniBackNav from "@/components/backNav/UniBackNav";
import UniShowShelf from "@/components/showShelf/UniShowShelf";

export default {
  components: {
    UniBackNav,
    UniShowShelf
  },
  data() {
    return {
      isShowPlayPage: false,
      isActive: false,
      message: [
          {icon: 'icon-message', text: '消息'},
          {icon: 'icon-app', text: 'MOO COVER'},
        ],
    }
  },
  onBackPress() {
    if (this.isShowPlayPage) {
      this.isMove = this.isReach = this.isShowPlayPage = false;
      return true;
    }
  },
  computed: {
    getColSongs() {
      return Object.values(this.$store.state.colSongs).reverse();
    },

    getColPlaylists() {
      return Object.values(this.$store.state.colPlaylists).reverse();
    },

    getRecentPlaySongs() {
      return this.$store.state.recentPlaySongs;
    },

    showData() {
      return [
        {
          icon: 'icon-heart',
          text: '收藏',
          count: this.getColSongs.length,
          pic: this.getColSongs.slice(0, 3),
          route: '/pages/collect/Collect'
        },
        {
          icon: 'icon-playlist',
          text: '歌单',
          count: this.getColPlaylists.length,
          pic: this.getColPlaylists.slice(0, 3),
          route: '/pages/collectPlaylist/CollectPlaylist'
        },
        {
          icon: 'icon-file',
          text: '本地歌曲',
          pic: [],
          count: 0
        },
        {
          icon: 'icon-time',
          text: '最近播放',
          count: this.getRecentPlaySongs.length,
          pic: this.getRecentPlaySongs.slice(0, 3),
          route: '/pages/recentPlay/RecentPlay'
        },
      ]
    }
  },
  methods: {
    onTouchstart(e) {
      this.startX = e.touches[0].clientX;
      this.isMove = false;
    },

    onTouchmove: throttle(function (e) {
      this.isReach = e.touches[0].clientX - this.startX >= 10;
    }, 100),

    onTouchend() {
      if (!this.isMove && this.isReach) {
        this.isMove = true;
        uni.navigateBack({
          delta: 1,
          success: () => {
            this.isMove = this.isReach = false;
          }
        })
      }
    },

    toPlayPage() {
      this.isShowPlayPage = this.isActive = true;

    }
  }
}
</script>

<style scoped lang="scss">
  .profile{
    position: relative;
    height: 100vh;
    background-color: $bgc-black2;

    .title{
      color: $font-color-white;
      font-size: 38rpx;
      text-align: center;
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
    }
    .btn{
      @include wh(120rpx, 120rpx);
      border: none;
      border-radius: 50%;
      float: right;
      margin: 62rpx 10rpx;
      .icon-setting{
        color: $font-color-white;
        font-size: $icon-size;
        font-weight: bold;
      }
    }
    .hover_set{
      @include hover();
    }

    .profile_info{
      @include wh($container-size, 300rpx);
      margin: 220rpx auto 0;
      border-radius: 20rpx;
      background-color: $bgc-black1;
      font-weight: bold;

      .detail{
        padding: 30rpx 20rpx 20rpx;
        color: $font-color-white;
        .icon-user{
          font-size: 70rpx;
        }
        .name{
          font-size: 38rpx;
          vertical-align: top;
          position: relative;
          left: 30rpx;
        }
      }

      .other{
        display: flex;
        padding: 80rpx 20rpx 20rpx;
        justify-content: space-evenly;
        align-items: center;
        color: $profile-grey;
        .subscribe{
          flex: 1;
          display: flex;
          justify-content: space-between;
          font-size: 34rpx;
          .count{
            font-size: 40rpx;
            position: relative;
            left: 20rpx;
          }
        }
        .vip{
          flex: 1;
          text-align: right;
          .text{
            padding: 0 15rpx;
            color: $bgc-black1;
            background-color: $profile-grey;
            border-radius: 20rpx;
          }
        }
      }
    }

    .player_info{
      margin: 50rpx auto 0;
    }

    .message{
      width: $container-size;
      margin: 50rpx auto 0;
      color: $font-color-white;
      .item{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .iconfont{
          width: 10%;
          padding: 40rpx 20rpx;
          text-align: center;
          font-size: 40rpx;
        }
        .content{
          width: 70%;
          font-size: 34rpx;
          font-weight: bold;
        }
        .icon-arrow{
          color: $font-color-grey;
        }
      }
    }
  }
</style>