<template>
  <view class="home_album">
    <view class="album_info" v-for="(item, index) in album" :key="index">
      <view class="album_pic">
        <image :src="item.coverUrl + '?param=200y200'"
               class="album_img"
               lazy-load>
        </image>
        <image src="~@/static/cd.png"
               class="cd"
               lazy-load>
        </image>
      </view>
      <view class="album_detail">
        <view class="album_name">{{item.albumName}}</view>
        <view class="artist_name">{{item.artistName}}</view>
        <button type="default"
                size="mini"
                class="album_flag"
                hover-class="btn_hover">
          #Hot
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    album: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .home_album{
    width: $container-size;
    margin: 0 auto 50rpx;

    .album_info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      margin-bottom: 50rpx;

      .album_pic{
        flex: 1.3;
        .album_img{
          @include wh(300rpx, 300rpx);
          border-radius: 12rpx;
        }
        .cd{
          @include wh(50rpx, 200rpx);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .album_detail{
        height: 220rpx;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        align-content: space-between;
        margin-right: 30rpx;
        .album_name{
          width: 100%;
          color: $font-color-white;
          font-size: 38rpx;
          font-weight: bold;
        }
        .artist_name{
          width: 100%;
          color: $font-color-grey;
        }
        .album_flag{
          @include button();
        }
        .btn_hover{
          opacity: 0.7;
        }
      }
    }
  }
</style>