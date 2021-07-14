<template>
  <view class="uni_tab_control">
    <button class="tab"
            size="mini"
            plain
            hover-class="hover_tab"
            hover-stay-time="200"
            v-for="(item, index) in tab"
            :key="index"
            @click="onTab(index)">
      <view class="content"
            :class="[currentIndex === index ? 'active' : '']">
        {{item}}
      </view>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    tab: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  methods: {
    onTab(index) {
      this.currentIndex = index;
      this.$emit('tabControl', index);
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_tab_control{
    position: fixed;
    z-index: 1000;
    width: 100%;
    top: 14%;
    /* #ifndef APP-PLUS */
    /* #endif */
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $font-color-grey;
    background-color: $bgc-black2;

    .tab{
      height: 86rpx;
      flex: 1;
      font-size: 36rpx;
      font-weight: bold;
      border: none;
      .content{
        width: 80rpx;
        margin: 0 auto;
      }
    }
    .hover_tab{
      @include hover();
    }
    .active{
      color: $font-color-white;
      border-bottom: 6rpx solid $font-color-white;
    }
  }
</style>