<template>
  <text
    class="iconfont btn-zoom"
    :class="type"
    :style="{ ...(size ? {fontSize: size} : {}), ...(color ? {color: color} : {}) }"
    @tap="$emit('click')"
  />
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>

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
