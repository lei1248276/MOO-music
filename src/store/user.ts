import type { Profile } from '@/api/interface/LoginStatus'
import type { UserSubcountResponse } from '@/api/interface/UserSubcount'
import { getUserSubcount } from '@/api/profile'
import { getLoginStatus, logout as userLogout } from '@/api/login'

export const useUserStore = defineStore('user', () => {
  const profile = ref<Profile | null>()
  const subcount = ref<UserSubcountResponse>()

  async function login(cookie: string) {
    const { data } = await getLoginStatus(cookie)
    console.log('🚀 ~ file: user.ts:15 ~ getLoginStatus ~ data:', data)
    profile.value = data.profile
  }

  async function logout() {
    const res = await userLogout()
    console.log('🚀 ~ file: user.ts:15 ~ logout ~ res:', res)

    if (res.code === 200) {
      profile.value = null
      subcount.value = undefined
      uni.removeStorage({ key: 'cookie' })
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }

  return {
    profile,
    subcount,
    login,
    logout
  }
})

export function setupLogin(cookie = uni.getStorageSync('cookie')) {
  if (!cookie) return

  const userStore = useUserStore()
  userStore.login(cookie)

  // * 存入用户订阅信息到仓库
  getUserSubcount().then(res => {
    console.log('🚀 ~ file: user.ts:41 ~ getUserSubcount ~ res:', res)
    userStore.subcount = res
  })
}
