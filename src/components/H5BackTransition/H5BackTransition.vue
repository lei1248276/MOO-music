<template>
  <!-- ! BUG：避免'uni-transition'内部插槽整个重新渲染（全量diff），'uni-transition'的状态会重置（https://github.com/dcloudio/uni-app/issues/3412） -->
  <uni-transition
    v-bind="$attrs"
    :mode-class="['slide-right']"
    @change="onShowChange"
  >
    <slot />
  </uni-transition>
</template>

<script setup lang="ts">
import type { UniTransitionProps } from '@uni-helper/uni-ui-types'
import type { UniTransitionOnChangeEvent } from '@uni-helper/uni-ui-types'

interface TransitionProps extends UniTransitionProps {}

defineProps<TransitionProps>()

function onShowChange({ detail: isShow }: UniTransitionOnChangeEvent) {
  !isShow && uni.navigateBack()
}
</script>
