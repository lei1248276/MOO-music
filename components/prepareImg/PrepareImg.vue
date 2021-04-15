<template>
  <view class="Prepare_img" v-once>
    <text class="content" :style="{'font-size': fz + 'vh'}">MOO</text>
  </view>
</template>

<script>
export default {
  props: {
    fz: {
      type: Number,
      default: 14
    }
  }
}
</script>

<style scoped lang="scss">
  .Prepare_img{
    @include wh(100%, 100%);
    position: absolute;
    top: 0;
    left: 0;
    color: $font-color-white;
    background-color: $bgc-black2;
    .content{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
</style>