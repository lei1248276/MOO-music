// * 生成范围随机数
export function rangeRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// * 数组洗牌
export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function transHTTPS(url: string) {
  const reg = /^http:/
  return reg.test(url) ? url.replace(reg, 'https:') : url
}

export function debounce(fn: Function, delay: number) {
  let timer: null | number = null

  return function(this:any, ...arg: any[]) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => { fn.apply(this, arg) }, delay)
  }
}

export function throttle(fn: Function, threshold: number) {
  let time = Date.now()

  return function(this: any, ...arg: any[]) {
    console.log(Date.now() - time)

    if (Date.now() - time < threshold) return
    fn.apply(this, ...arg)
    time = Date.now()
  }
}
