<template>
  <view class="uni_col_playlist">
    <view class="playlist_container"
          v-for="(item) in playlist"
          :key="item.id"
          @click="toSonglist(item)">

      <uni-custom-checkbox v-if="selectable"
                           ref="checkbox" :checked="item.isChecked"
                           @click.native.stop="onSelect(item)">
      </uni-custom-checkbox>

      <image class="playlist_img"
             mode="aspectFill"
             :src="item.picUrl + '?param=140y140'">
      </image>

      <view class="playlist_detail">
        <view class="name">{{ item.name }}</view>
        <view class="creator">{{ item.songCount }}首 - {{item.creatorNickname}}</view>
      </view>

    </view>
  </view>
</template>

<script>
import types from "@/store/mutations-types";

export default {
  props: {
    playlist: {
      type: Array,
      default() {
        return []
      }
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toSonglist(item) {
      // 点击menu进行选择时
      if (this.selectable) {
        this.onSelect(item);
        return
      }

      uni.navigateTo({
        url: `/pages/songlist/Songlist?id=${item.id}`,
        animationType: 'slide-in-right',
        animationDuration: 300,
      });
      this.$store.commit(types.SET_SONGLIST_DETAILS, item);
    },

    onSelect(item) {
      item.isChecked = !item.isChecked;
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_col_playlist{
    width: 90%;
    margin: 0 50rpx;
    padding-bottom: 320rpx;

    .playlist_container {
      @include wh(100%, 200rpx);
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50rpx;

      .playlist_img {
        @include wh(200rpx, 200rpx);
        border-radius: 16rpx;
        margin-right: 40rpx;
        will-change: transform;
      }

      .playlist_detail{
        flex: 1;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .name{
          width: 100%;
          color: $font-color-white;
          font-weight: bold;
          font-size: 36rpx;
        }

        .creator{
          width: 100%;
          color: $font-color-grey;
          font-size: 34rpx;
        }
      }
    }
  }
</style>