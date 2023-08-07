<template>
  <Navbar
    title="🎵 登录"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <!-- #ifdef H5 -->
  <H5BackTransition
    :show="isShowPage"
    class="relative w-full !h-4/5"
  >
    <!-- #endif -->
    <view class="z-50 mid">
      <JImage
        :src="qrimg"
        width="400rpx"
        height="400rpx"
      />

      <button
        class="font-bold bg-yellow-1 text-black-1 rounded-full my-4"
        :loading="isLoading"
        @tap.stop="login"
      >
        {{ isLoading ? '等待扫码...' : '点击扫码登录' }}
      </button>

      <uni-notice-bar
        v-if="isLoading"
        class="rounded-md overflow-hidden"
        show-icon
        text="请截图保存后使用网易云音乐APP进行扫码"
      />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->
</template>

<script setup lang="ts">
import { createQRKey, createQRImg, checkQRStatus } from '@/api/login'
import toast from '@/utils/toast'

// #ifdef H5
const isShowPage = ref(true)
// #endif

const qrimg = ref('')
const isLoading = ref(false)
const isLogin = ref(false)

let timer: number | undefined
onBeforeUnmount(() => { timer && clearInterval(timer) })

async function login() {
  isLoading.value = true

  const { data: { unikey }} = await createQRKey()
  console.log('🚀 ~ file: index.vue:73 ~ qr/key ~ :', unikey)
  const { data: { qrimg: _qrimg }} = await createQRImg(unikey)
  qrimg.value = _qrimg

  timer = setInterval(async() => {
    const { code, cookie } = await checkQRStatus(unikey)
    console.log('🚀 ~ file: login.vue:54 ~ timer=setInterval ~ checkQRStatus:', { code, cookie })

    switch (code) {
      case 800: {
        toast.fail('二维码已过期,请重新获取')
        clearInterval(timer)
        isLoading.value = false
        qrimg.value = ''
        break
      }
      case 803: { // * 这一步会返回cookie
        clearInterval(timer)

        // ! 截取需要的“cookie”小程序端不会自动发送cookie  ps: cookie是以分号加空格进行分割的
        const cookies = cookie.match(/MUSIC_U=?\w+\;/)![0] + ' ' + cookie.match(/__csrf=?\w+\;/)![0]
        console.log('🚀 ~ file: login.vue:80 ~ cookies:', cookies)

        isLoading.value = false
        isLogin.value = true
        useUserStore().login(cookie)
        uni.setStorage({ key: 'cookie', data: cookies })
        uni.reLaunch({ url: '/pages/index/index' })
        break
      }
    }
  }, 3000)
}
</script>
