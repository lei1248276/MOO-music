<template>
  <view class="uni_show_shelf">

    <view class="shelf"
          v-for="(item, index) in showData"
          :key="index"
          @click="toCollect(item.route)">

      <view class="photo_frame">
        <view v-if="!item.pic[0]" class="pic1">
          <text class="iconfont" :class="item.icon"></text>
        </view>
        <image v-else class="img1"
               :src="item.pic[0].picUrl + '?param=80y80'"
               mode="aspectFill">
        </image>

        <view v-if="!item.pic[1]"
              class="pic2">
        </view>
        <image v-else class="img2"
               :src="item.pic[1].picUrl + '?param=80y80'"
               mode="aspectFill">
        </image>

        <view v-if="!item.pic[2]"
              class="pic3">
        </view>
        <image v-else class="img3"
               :src="item.pic[2].picUrl + '?param=80y80'"
               mode="aspectFill">
        </image>
      </view>

      <view class="detail">
        <text class="content">{{item.text}}</text>
        <text class="count">{{item.count || ''}}</text>
      </view>

    </view>

  </view>
</template>

<script>
export default {
  props: {
    showData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    toCollect(route) {
      uni.navigateTo({
        url: route,
        animationType: 'slide-in-right',
        animationDuration: 300,
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_show_shelf{
    @include wh($container-size, 500rpx);
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;

    .shelf{
      @include wh(45%, 200rpx);
      display: flex;
      align-content: space-between;
      flex-wrap: wrap;

      .photo_frame{
        @include wh(90%, 130rpx);
        margin: 10rpx auto 0;
        display: flex;
        align-items: flex-end;
        .pic1{
          @include wh(50%, 100%);
          position: relative;
          z-index: 3;
          box-shadow: 4rpx 0 20rpx rgba(0, 0, 0, .5);
          background-color: $profile-grey;
          .iconfont{
            color: $font-color-white;
            font-size: 80rpx;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
          }
        }
        .img1{
          @include wh(50%, 100%);
        }

        .pic2{
          @include wh(27%, 90%);
          position: relative;
          z-index: 2;
          box-shadow: 4rpx 0 20rpx rgba(0, 0, 0, .5);
          background-color: $profile-grey;
        }
        .img2{
          @include wh(27%, 90%);
        }

        .pic3{
          @include wh(23%, 90%);
          position: relative;
          z-index: 1;
          background-color: $profile-grey;
        }
        .img3{
          @include wh(23%, 90%);
        }
      }

      .detail{
        @include wh(100%, 30rpx);
        padding: 12rpx 20rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 20rpx;
        background-color: $bgc-black1;
        font-weight: bold;
        .content{
          color: $font-color-white;
        }
        .count{
          color: $profile-grey;
          font-size: 38rpx;
        }
      }
    }
  }
</style>