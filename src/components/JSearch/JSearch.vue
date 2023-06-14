<template>
  <view
    class="box-border flex items-center mx-[28rpx] my-[20rpx]"
    :class="customClass"
  >
    <view
      class="flex-1 flex justify-center items-center px-2 py-[4rpx]"
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
        class="flex-1 text-[30rpx] mx-2"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :focus="focus"
        :disabled="readonly"
        :maxlength="maxlength"
        confirm-type="search"
        type="text"
        :style="{ color }"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.detail.value)"
      >

      <view
        v-if="clearButton"
        v-show="modelValue"
        @tap="$emit('update:modelValue', ''); $emit('clear')"
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
        class="ml-[28rpx] text-white-1"
        @tap="$emit('update:modelValue', ''); $emit('cancel')"
      >
        取消
      </view>
    </slot>
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
  cancelButton?: boolean
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
  cancelButton: false,
  customClass: ''
})
defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
  (e: 'click'): void
  (e: 'focus'): void
  (e: 'confirm'): void
  (e: 'blur'): void
  (e: 'cancel'): void
}>()
</script>
