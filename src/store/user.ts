import type { Profile } from '@/api/interface/LoginStatus'
import { getLoginStatus, logout as userLogout } from '@/api/login'

export const useUserStore = defineStore('user', () => {
  const profile = ref<Profile | null>()

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
      uni.removeStorage({ key: 'cookie' })
    }
  }

  return {
    profile,
    login,
    logout
  }
})
