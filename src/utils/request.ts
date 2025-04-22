import simpleAxios from './simpleAxios'
import toast from './toast'

export const BASE_URL = 'https://neteasecloudmusicapi.vercel.app'
export const MOO_API = BASE_URL

const request = simpleAxios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

/* request.interceptors.request.use(
  (config) => {
    // console.log('🚀 ~ file: request.ts:11 ~ config:', config)
    return config
  }, (err) => {
    toast.fail()
    return Promise.reject(err)
  }) */

request.interceptors.response.use(
  (response) => {
    // console.log('🚀 ~ file: request.ts:20 ~ response:', response)
    const { data } = response
    const code = data.code || data.data?.code

    switch (code) {
      case 800: // * 登录二维码过期
      case 801: // * 等待扫码
      case 802: // * 待确认
      case 803: // * 授权登录成功
      case 200: return data
    }

    return (Promise.reject(new Error(data.message || '请求失败')))
  }, (err) => {
    if (err.errMsg === 'request:fail abort') return Promise.reject(err)

    console.error(err)
    // toast.fail()
    return Promise.reject(err)
  })

export default request
