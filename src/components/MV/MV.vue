<template>
  <view class="relative w-full h-[500rpx]">
    <video
      v-if="isPlay || source"
      :src="source"
      :poster="poster"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :initialTime="initialTime"
      :duration="duration"
      :controls="controls || true"
      :danmuList="danmuList"
      :danmuBtn="danmuBtn"
      :enableDanmu="enableDanmu"
      :pageGesture="pageGesture"
      :direction="direction"
      :showProgress="showProgress || true"
      :showFullscreenBtn="showFullscreenBtn || true"
      :showPlayBtn="showPlayBtn || true"
      :showCenterPlayBtn="showCenterPlayBtn || true"
      :showLoading="showLoading || true"
      :enableProgressGesture="enableProgressGesture || true"
      :objectFit="objectFit || 'contain'"
      :showMuteBtn="showMuteBtn"
      :title="title"
      :playBtnPosition="playBtnPosition || 'bottom'"
      :mobilenetHintType="mobilenetHintType || 1"
      :enablePlayGesture="enablePlayGesture"
      :autoPauseIfNavigate="autoPauseIfNavigate || true"
      :autoPauseIfOpenNative="autoPauseIfOpenNative || true"
      :vslideGesture="vslideGesture"
      :vslideGestureInFullscreen="vslideGestureInFullscreen || true"
      :adUnitId="adUnitId"
      :posterForCrawler="posterForCrawler"
      :codec="codec || 'hardware'"
      :httpCache="httpCache"
      :playStrategy="playStrategy || 0"
      :header="header"
      class="w-full h-full"
      @play="isPlay = true"
      @touchstart.stop
    />
    <template v-else>
      <JImage
        :src="poster"
        @click="isPlay = true"
      />
      <JIcon
        custom-class="icon-audioPlay text-[100rpx] text-white-1 mid"
        @click="isPlay = true"
      />
    </template>
  </view>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>

<script setup lang="ts">
interface Props {
  /** 要播放视频的资源地址 */
  src: string
  /**
   * 视频封面的图片网络资源地址
   *
   * 如果 controls 值为 false 则无效
   */
   poster: string;
  /**
   * 是否自动播放
   *
   * 默认为 false
   */
  autoplay?: boolean;
  /**
   * 是否循环播放
   *
   * 默认为 false
   */
  loop?: boolean;
  /**
   * 是否静音播放
   *
   * 默认为 false
   */
  muted?: boolean;
  /**
   * 指定视频初始播放位置
   *
   * 单位为 s
   */
  initialTime?: number;
  /**
   * 指定视频长度
   *
   * 单位为 s
   */
  duration?: number;
  /**
   * 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
   *
   * 默认为 true
   */
  controls?: boolean;
  /** 弹幕列表 */
  danmuList?: {
    /** 弹幕文本 */
    text: string;
    /** 弹幕颜色 */
    color: string;
    /**
     * 弹幕出现时间
     *
     * 单位为 s
     */
    time: number;
  }[];
  /**
   * 是否显示弹幕按钮，不支持动态修改
   *
   * 默认为 false
   */
  danmuBtn?: boolean;
  /**
   * 是否展示弹幕，不支持动态修改
   *
   * 默认为 false
   */
  enableDanmu?: boolean;
  /**
   * 在非全屏模式下，是否开启亮度与音量调节手势
   *
   * 默认为 false
   */
  pageGesture?: boolean;
  /**
   * 设置全屏时视频的方向，不指定则根据宽高比自动判断
   *
   * 0 正常竖向
   *
   * 90 屏幕逆时针 90 度
   *
   * -90 屏幕顺时针 90 度
   *
   * 默认根据宽高比自动判断
   */
  direction?: 0 | 90 | -90;
  /**
   * 若不设置，宽度大于 240 时才会显示
   *
   * 默认为 true
   */
  showProgress?: boolean;
  /**
   * 是否显示全屏按钮
   *
   * 默认为 true
   */
  showFullscreenBtn?: boolean;
  /**
   * 是否显示视频底部控制栏的播放按钮
   *
   * 默认为 true
   */
  showPlayBtn?: boolean;
  /**
   * 是否显示视频中间的播放按钮
   *
   * 默认为 true
   */
  showCenterPlayBtn?: boolean;
  /**
   * 是否显示 loading 控件
   *
   * 默认为 true
   */
  showLoading?: boolean;
  /**
   * 是否开启控制进度的手势
   *
   * 默认为 true
   */
  enableProgressGesture?: boolean;
  /**
   * 当视频大小与 video 容器大小不一致时，视频的表现形式
   *
   * contain 包含
   *
   * fill 填充
   *
   * cover 覆盖
   *
   * 默认为 contain
   */
  objectFit?: 'contain' | 'fill' | 'cover';
  /**
   * 是否显示静音按钮
   *
   * @decs 默认为 false
   */
  showMuteBtn?: boolean;
  /** 视频的标题，全屏时在顶部展示 */
  title?: string;
  /**
   * 播放按钮的位置
   *
   * bottom 控制栏上
   *
   * center 视频中间
   *
   * 默认为 bottom
   */
  playBtnPosition?: 'bottom' | 'center';
  /**
   * 移动网络提醒样式
   *
   * 0 不提醒
   *
   * 1 提醒
   *
   * 默认为 1
   */
  mobilenetHintType?: 0 | 1;
  /**
   * 是否开启播放手势，即双击切换播放、暂停
   *
   * 默认为 false
   */
  enablePlayGesture?: boolean;
  /**
   * 当跳转到其它小程序页面时，是否自动暂停本页面的视频
   *
   * 默认为 true
   */
  autoPauseIfNavigate?: boolean;
  /**
   * 当跳转到其它微信原生页面时，是否自动暂停本页面的视频
   *
   * 默认为 true
   */
  autoPauseIfOpenNative?: boolean;
  /**
   * 在非全屏模式下，是否开启亮度与音量调节手势（同 page-gesture）
   *
   * 默认为 false
   */
  vslideGesture?: boolean;
  /**
   * 在全屏模式下，是否开启亮度与音量调节手势
   *
   * 默认为 true
   */
  vslideGestureInFullscreen?: boolean;
  /** 视频前贴广告单元ID */
  adUnitId?: string;
  /**
   * 用于给搜索等场景作为视频封面展示
   *
   * 建议使用无播放 icon 的视频封面图
   *
   * 只支持网络地址
   */
  posterForCrawler?: string;
  /**
   * 解码器选择
   *
   * hardware 硬件解码
   *
   * software 软件解码
   *
   * 默认为 hardware
   */
  codec?: 'hardware' | 'software';
  /**
   * 是否对 http、https 视频源开启本地缓存
   *
   * 默认为 true
   */
  httpCache?: boolean;
  /**
   * 播放策略
   *
   * 0 普通模式，适合绝大部分视频播放场景
   *
   * 1 平滑播放模式（降级），增加缓冲区大小，采用 open sl 解码音频，避免音视频脱轨的问题，可能会降低首屏展现速度、视频帧率，出现开屏音频延迟等，适用于高码率视频的极端场景
   *
   * 2 M3U8 优化模式，增加缓冲区大小，提升视频加载速度和流畅度，可能会降低首屏展现速度，适用于 M3U8 在线播放的场景
   *
   * 默认为 0
   */
  playStrategy?: 0 | 1 | 2;
  /** HTTP 请求 Header */
  header?: Record<string, any>;
}

const props = defineProps<Props>()

const isPlay = ref(false)
const source = ref('')

//* 避免卡顿
watch(() => props.src, src => {
  setTimeout(() => {
    source.value = src || ''
  }, 333)
})
</script>
