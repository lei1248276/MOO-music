/**
 * @description 异步获取缓存数据
 * @param key 缓存key
 * @param fallback 初始值，获取到缓存后会更新初始值
 */
export default function useCache<T>(key: string, fallback: T) {
  uni.getStorage({
    key,
    success({ data }) {
      if (!data) return

      if (isRef(fallback)) {
        fallback.value = data

        watch(fallback, (value) => {
          uni.setStorage({
            key,
            data: value,
            fail(err) { console.error(err) }
          })
        })

        return
      }

      if (isReactive(fallback)) {
        Array.isArray(data) && Array.isArray(fallback)
          ? data.forEach((v, i) => { fallback[i] = v })
          : Object.assign(fallback as object, data)

        watch(() => fallback, (value) => {
          uni.setStorage({
            key,
            data: value,
            fail(err) { console.error(err) }
          })
        }, { deep: true })

        return
      }
    },
    fail(err) { console.error(err) }
  })

  return fallback
}
