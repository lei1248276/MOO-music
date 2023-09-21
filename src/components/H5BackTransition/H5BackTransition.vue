<template>
  <!-- ! BUG：避免'uni-transition'内部插槽整个重新渲染（全量diff），'uni-transition'的状态会重置（https://github.com/dcloudio/uni-app/issues/3412） -->
  <uni-transition
    v-bind="$attrs"
    :mode-class="['slide-right']"
    :show="($attrs.show as boolean | undefined) ?? isShow"
    class="w-full h-auto"
    @change="onShowChange"
  >
    <!-- * 嵌套一层"view"用于解决'uni-transition'重新渲染状态重置问题（网页端"view"也是组件） -->
    <view class="w-full h-full">
      <slot />
    </view>
  </uni-transition>
</template>

<script setup lang="ts">
import type { UniTransitionProps } from '@uni-helper/uni-ui-types'
import type { UniTransitionOnChangeEvent } from '@uni-helper/uni-ui-types'

interface TransitionProps extends UniTransitionProps {}

defineProps<TransitionProps>()

const isShow = ref(false)

function onShowChange({ detail: isShow }: UniTransitionOnChangeEvent) {
  !isShow && uni.navigateBack()
}

defineExpose({
  open: () => (isShow.value = true),
  close: () => (isShow.value = false)
})
</script>
