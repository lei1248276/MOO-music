import Request from 'luch-request'
import toast from './toast'

const request = new Request({
  // baseURL: 'https://netease-cloud-music-api-jaye.vercel.app'
  baseURL: 'https://netease-music-api.fe-mm.com'
})

request.interceptors.request.use(
  (config) => {
    // console.log('🚀 ~ file: request.ts:11 ~ config:', config)
    return config
  }, (err) => {
    toast.fail()
    return Promise.reject(err)
  })

request.interceptors.response.use(
  (response) => {
    console.log('🚀 ~ file: request.ts:20 ~ response:', response)
    const { data, statusCode } = response
    if (!data) return (toast.fail(), response)

    if (data.code !== 200 || statusCode !== 200) {
      return (toast.fail(), Promise.reject(new Error(data.message || '请求失败')))
    }

    return response
  }, (err) => {
    console.error(err)
    toast.fail()
    return Promise.reject(err)
  })

export default request
