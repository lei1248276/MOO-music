<template>
  <view
    class="flex justify-center items-center px-2 py-[4rpx] m-[20rpx]"
    :class="customClass"
    :style="{borderRadius: radius, backgroundColor: bgColor }"
    @tap="isActive = true"
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
      :value="modelValue"
      class="flex-1 text-[30rpx] mx-2"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :focus="focus || isActive"
      :disabled="readonly"
      :maxlength="maxlength"
      confirm-type="search"
      type="text"
      :style="{ color }"
      @input="$emit('update:modelValue', $event.detail.value)"
    >

    <view
      v-if="isActive && clearButton"
      v-show="modelValue"
      @tap="$emit('update:modelValue', ''); emit('clear')"
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
interface JSearchProps {
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

withDefaults(defineProps<JSearchProps>(), {
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
</script>
