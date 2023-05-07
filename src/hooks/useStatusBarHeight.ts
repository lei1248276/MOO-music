export default function useStatusBarHeight() {
  const height = ref(0)

  uni.getSystemInfo({
    success({ statusBarHeight }) {
      height.value = statusBarHeight || 0
    }
  })

  return height
}
