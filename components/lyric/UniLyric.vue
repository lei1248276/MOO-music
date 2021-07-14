<template>
  <!--  lyric  -->
  <view class="lyric">
    <view>{{getLrc}}</view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "UniLyric",
  computed: {
    ...mapState({
      getCurrentTime: 'currentTime',
      getCurrentLyric: 'currentLyric'
    }),

    // 获取处理后的歌词（与播放时间相匹配就切换歌词）
    getLrc({getCurrentTime: curTime, getCurrentLyric: {lrcTimeMap: time, lrcContentMap: content}}) {
      if (!content) return;
      if (curTime >= time[0]) {
        time.shift();
        content.shift();
      }
      return content[0];
    },
  }
}
</script>

<style scoped lang="scss">
.lyric{
  width: 85%;
  max-height: 240rpx;
  overflow: hidden;
  color: $font-color-white;
  font-size: $icon-size;
  font-weight: bold;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>