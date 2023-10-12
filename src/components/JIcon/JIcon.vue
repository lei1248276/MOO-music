<template>
  <text
    class="iconfont btn-zoom"
    :class="type"
    :style="{ ...(size ? {fontSize: size} : {}), ...(color ? {color: color} : {}) }"
    @tap="$emit('click')"
  />
</template>

<!-- !隐藏微信小程序shadowRoot  p.s：小程序添加此选项"v-show"会失效，需要使用css解决。艹 -->
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
withDefaults(defineProps<{
  type?: string
  size?: string
  color?: string
}>(), {
  type: '',
  size: '',
  color: ''
})

defineEmits(['click'])
</script>
