<template>
  <Navbar
    title="🎵 登录"
    left-arrow
  />

  <!-- #ifdef H5 -->
  <H5BackTransition
    :ref="(el: any) => el?.open()"
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
        @tap.stop="toNetease"
      >
        {{ qrimg ? '打开网易云音乐' : '获取二维码中...' }}
      </button>

      <uni-notice-bar
        v-if="qrimg"
        class="rounded-md overflow-hidden"
        show-icon
        text="请手动截图保存后,点击按钮跳转网易云音乐进行扫码（**小程序不支持跳转**）"
      />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->
</template>

<script setup lang="ts">
import { createQRKey, createQRImg, checkQRStatus } from '@/api/login'
import toast from '@/utils/toast'

const qrimg = ref('')
const isLoading = ref(false)

let timer: number | undefined
onBeforeUnmount(() => { timer && clearInterval(timer) })

login()

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

        setupLogin(cookie) // ! 执行登录
        uni.setStorage({ key: 'cookie', data: cookies })
        uni.reLaunch({ url: '/pages/index/index' })
        break
      }
    }
  }, 3000)
}

function toNetease() {
  // #ifdef H5
  H5ToNetease()
  // #endif

  // #ifdef APP-PLUS
  APPToNetease()
  // #endif

  // ! 小程序跳不了...
}

// #ifdef H5
function H5ToNetease() {
  // * 提前创建一个定时器作为结果预测提示
  const timer = setTimeout(() => {
    console.error('跳转失败。。。')
    toast.fail('如果跳转失败请手动打开')
  }, 3000)

  // * 添加一个“visibilitychange”事件用于判断是否发生了跳转
  document.addEventListener('visibilitychange', onChange)
  function onChange() {
    if (document.hidden) {
      console.log('跳转APP')
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onChange)
    }
  }

  // * 跳转APP
  window.location.href = 'orpheus://'
}
// #endif

// #ifdef APP-PLUS
function APPToNetease() {
  const scheme = 'orpheuswidget://'
  const packageName = 'com.netease.cloudmusic'

  if (!plus.runtime.isApplicationExist({ action: scheme, pname: packageName })) {
    console.error('网易云音乐APP未安装')
    toast.fail('请安装网易云音乐')
    return
  }

  function error(e: any) {
    console.error('打开网易云音乐失败: ' + e.message)
    toast.fail('打开网易云音乐失败, 请自行启动')
  }

  if (plus.os.name === 'Android') {
    plus.runtime.launchApplication({ pname: packageName }, error)
  } else if (plus.os.name === 'iOS') {
    plus.runtime.launchApplication({ action: scheme }, error)
  }
}
// #endif
</script>
