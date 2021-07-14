<template>
  <!-- #ifdef H5 -->
  <uni-transition :mode-class="['slide-right']" show>
    <!--  #endif  -->

    <view class="new_song_play_page">
      <uni-back-nav class="nav"></uni-back-nav>

      <uni-play-page></uni-play-page>
    </view>

    <!-- #ifdef H5 -->
  </uni-transition>
  <!--  #endif  -->
</template>

<script>
import UniPlayPage from "@/components/playPage/UniPlayPage";
import UniBackNav from "@/components/backNav/UniBackNav";

export default {
  components: {
    UniPlayPage,
    UniBackNav
  }
}
</script>

<style scoped lang="scss">
  .new_song_play_page{
    @include wh(100vw, 100vh);

    .nav{
      background-color: transparent;
    }
  }
</style>