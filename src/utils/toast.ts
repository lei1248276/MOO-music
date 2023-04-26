const toast = {
  state: {
    count: 0
  },
  start(message?: string): number | void {
    if (this.state.count !== 0) return ++this.state.count

    uni.showLoading({
      title: message || '加载中...',
      mask: true
    })
    ++this.state.count
  },
  close(): number | void {
    if (this.state.count > 1) return --this.state.count

    uni.hideLoading()
    --this.state.count
  },
  success(title: string, callback?: () => void) {
    this.state.count = 0

    uni.showToast({
      icon: 'success',
      title,
      duration: 1000,
      complete: callback
    })
  },
  fail(title?: string, callback?: () => void) {
    this.state.count = 0

    uni.showToast({
      icon: 'error',
      title: title || '请求失败',
      duration: 2000,
      complete: callback
    })
  }
}

export default toast
