<template>
  <view
    class="h-[50rpx] flex justify-center items-center gap-x-2 px-[20rpx] py-[10rpx] m-[20rpx]"
    :class="customClass"
    :style="{borderRadius: radius, backgroundColor: bgColor }"
    @click="isActive = true"
  >
    <slot name="searchIcon">
      <uni-icons
        color="#c0c4cc"
        size="18"
        type="search"
      />
    </slot>

    <input
      v-if="isActive"
      ref="input"
      v-model="search"
      class="flex-1 text-[30rpx]"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :focus="focus || isActive"
      :disabled="readonly"
      :maxlength="maxlength"
      confirm-type="search"
      type="text"
      :style="{ color }"
    >

    <view
      v-if="isActive && clearButton"
      v-show="search"
      @click="search = ''; emit('clear')"
    >
      <slot name="clearIcon">
        <uni-icons
          color="#c0c4cc"
          size="20"
          type="clear"
        />
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { InputProps } from '@uni-helper/uni-app-types'

interface JSearchProps extends InputProps {
  modelValue: string
  placeholder?: string
  placeholderStyle?: string
  radius?: string
  bgColor?: string
  color?: string
  focus?: boolean
  readonly?: boolean
  maxlength?: number
  clearButton?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<JSearchProps>(), {
  placeholder: '',
  placeholderStyle: '',
  radius: '10rpx',
  bgColor: '#F8F8F8',
  color: '#333',
  focus: false,
  readonly: false,
  maxlength: 140,
  clearButton: true,
  customClass: ''
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
}>()

const isActive = ref(false)
const search = ref<string>('')

watch(() => props.modelValue, (value) => { search.value = value })
watch(search, (value) => { emit('update:modelValue', value) })
</script>
