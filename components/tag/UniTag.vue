<template>
  <view class="uni_tag">
    <button class="tab_btn" type="default" size="mini" hover-class="btn_hover"
            v-for="item in tag" :key="item">{{item}}
    </button>
  </view>
</template>

<script>
export default {
  props: {
    tag: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_tag{
    width: $container-size;
    margin: 0 auto 50rpx;
    .tab_btn{
      @include button();
      margin-right: 20rpx;
    }
    .btn_hover{
      opacity: 0.7;
    }
  }
</style>