<template>
  <view class="uni_song_control">

    <view class="song_play">
      <button class="btn"
              type="default"
              size="mini"
              @click.stop="onPlay">
        <text class="iconfont icon-play"></text>
      </button>
      <text class="text">{{ count }}</text>
    </view>

    <view class="song_menu"
          @click.stop="onMenu">
      <button class="btn"
              plain
              hover-class="hover">
        <text class="iconfont icon-menu"></text>
      </button>
    </view>

  </view>
</template>

<script>
export default {
  props: {
    count: Number,
    default: 1
  },
  methods: {
    onPlay() {
      this.$emit('play');
    },

    onMenu() {
      this.$emit('menu');
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_song_control{
    width: $container-size;
    height: 100rpx;
    margin: 0 auto 50rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .song_play{
      flex: 1;
      display: flex;
      align-items: center;
      .btn{
        width: 140rpx;
        height: 58rpx;
        background-color: $icon-color-orange;
        border-radius: 40rpx;
        margin: 0 40rpx 0 20rpx;
      }
      .icon-play{
        position: relative;
        top: -20rpx;
        font-size: 42rpx;
      }
      .text{
        color: $font-color-grey;
        font-size: 38rpx;
        font-weight: bold;
      }
    }

    .song_menu{
      height: 100%;
      display: flex;
      align-items: center;
      flex: 1;

      .btn{
        @include wh(140rpx, 140rpx);
        position: relative;
        right: -40%;
        color: $font-color-grey;
        border: none;
        border-radius: 50%;
      }
      .icon-menu{
        position: relative;
        top: -20rpx;
        font-size: 72rpx;
      }
      .hover{
        @include hover();
      }
    }
  }
</style>