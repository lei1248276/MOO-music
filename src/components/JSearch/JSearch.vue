<template>
  <view class="flex items-center mx-[28rpx] my-[20rpx]">
    <view
      class="box-border h-[74rpx] flex-1 flex justify-center items-center px-2 py-[4rpx]"
      :style="{borderRadius: radius, backgroundColor: bgColor }"
      @tap="$emit('click')"
    >
      <slot name="searchIcon">
        <uni-icons
          color="#c0c4cc"
          size="18"
          type="search"
        />
      </slot>

      <input
        v-if="!readonly || focus || placeholder"
        :value="modelValue"
        class="flex-1 h-full text-[30rpx] mx-2"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :focus="focus"
        :disabled="readonly"
        :maxlength="maxlength"
        confirm-type="search"
        type="text"
        :style="{ color }"
        @input="$emit('update:modelValue', $event.detail.value)"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @confirm="$emit('confirm', $event.detail.value)"
      >

      <view
        v-if="clearButton"
        v-show="modelValue"
        class="btn-zoom"
        @tap="$emit('update:modelValue', ''); $emit('clear');"
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

    <slot
      v-if="cancelButton"
      name="cancel"
    >
      <view
        class="ml-[28rpx] text-white-1 btn-zoom"
        @tap="$emit('update:modelValue', ''); $emit('cancel')"
      >
        取消
      </view>
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
  cancelButton?: boolean
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
  cancelButton: false
})
defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
  (e: 'click'): void
  (e: 'focus'): void
  (e: 'confirm', value: string): void
  (e: 'blur'): void
  (e: 'cancel'): void
}>()
</script>
