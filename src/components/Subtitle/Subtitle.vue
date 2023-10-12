<template>
  <view
    class="my-[20rpx] py-[20rpx] text-[34rpx] font-bold text-white-1 flex justify-between items-center"
    :hover-class="clickable ? 'bg-grey-1/10' : ''"
    :hover-stay-time="50"
    @tap="onSubtitle"
  >
    <slot name="title">
      <text class="title">
        {{ title }}
      </text>
    </slot>

    <slot name="icon">
      <JIcon
        :type="icon"
        :size="iconSize"
        class="text-grey-1"
      />
    </slot>
  </view>
</template>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>
// #endif

<script setup lang="ts">
interface Props {
  title?: string
  icon?: `icon-${string}`
  iconSize?: string
  url?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  icon: 'icon-arrow',
  iconSize: '40rpx',
  url: '',
  clickable: false
})
const emit = defineEmits(['title'])

function onSubtitle() {
  emit('title')

  if (!props.url) return

  uni.navigateTo({ url: props.url, fail(err) { console.error(err) } })
}
</script>
