<template>
  <view class="uni_playlist">

    <view class="playlist_detail"
          @click="toSonglist(playlists[0])">
      <view class="detail_item">
        <image :src="playlists[0].picUrl + '?param=200y200'"
               lazy-load
               class="detail_img"
               @load="onLoaded">
        </image>
        <text class="iconfont icon-music pos"></text>
      </view>
      <view class="detail_item">
        <image src="~@/static/flag.png"
               lazy-load
               class="flag"
               @load="onLoaded">
        </image>
        <view>{{ playlists[0].name }}</view>
      </view>
    </view>

    <view class="playlist_item2"
          @click="toSonglist(playlists[1])">
      <image :src="playlists[1].picUrl + '?param=200y200'"
             lazy-load
             class="item2_img"
             @load="onLoaded">
      </image>
      <text class="iconfont icon-music pos"></text>
      <view class="content">{{playlists[1].name}}</view>
    </view>

    <view class="playlist_item3"
          @click="toSonglist(playlists[2])">
      <image :src="playlists[2].picUrl + '?param=200y200'"
             lazy-load
             class="item3_img">
      </image>
      <text class="iconfont icon-music pos"></text>
      <view class="content">{{playlists[2].name}}</view>
    </view>

  </view>
</template>

<script>
import types from "@/store/mutations-types"

export default {
  props: {
    playlists: {
      type: Array,
      default() {
        return []
      }
    },
  },
  created() {
    this.loadImg = 0;
  },
  methods: {
    onLoaded() {
      this.loadImg++;
      if (this.playlists.length === this.loadImg) {
        this.$emit('load', this.loadImg);
      }
    },

    toSonglist(item) {
      this.$store.commit(types.SET_SONGLIST_DETAILS, item);

      uni.navigateTo({
        url: `/pages/songlist/Songlist?id=${item.id}`,
        animationType: 'slide-in-right',
        animationDuration: 300,
        /*success: res => {
          res.eventChannel.emit('acceptSonglist', item);
        }*/
      });
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_playlist{
    @include wh($container-size, 800rpx);
    color: $font-color-white;
    font-weight: bold;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .playlist_detail{
      @include wh(100%, 340rpx);
      display: flex;
      justify-content: space-between;
      .detail_item{
        @include wh(48%, 332rpx);
        position: relative;
        overflow: hidden;
        .flag{
          @include wh(100%, 70%);
        }
        .detail_img{
          @include wh(100%, 100%);
          border-radius: 20rpx;
          will-change: transform;
        }
        .pos{
          position: absolute;
          right: 3%;
          bottom: 3%;
        }
      }
    }

    .icon-music{
      @include wh(54rpx, 54rpx);
      text-align: center;
      font-size: 42rpx;
      border-radius: 50%;
      background-color: #f1f1f1;
      color: #666;
    }

    .playlist_item2, .playlist_item3{
      @include wh(48%, 416rpx);
      position: relative;
      font-size: 38rpx;
      overflow: hidden;
      .item2_img, .item3_img{
        @include wh(100%, 300rpx);
        border-radius: 20rpx;
        will-change: transform;
      }
      .pos{
        position: absolute;
        right: 3%;
        bottom: 30%;
      }
      .content{
        height: 100rpx;
        overflow: hidden;
      }
    }

  }
</style>