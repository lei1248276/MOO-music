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
    if (Date.now() - time < threshold) return
    fn.apply(this, arg)
    time = Date.now()
  }
}

export function parseTime(time: Date | string | number, format = '{y}-{m}-{d} {h}:{i}:{s}'): string | null {
  if (!time) return null

  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        time = parseInt(time, 10)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key: keyof typeof formatObj) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') return ['日', '一', '二', '三', '四', '五', '六'][value]

    return value.toString().padStart(2, '0')
  })

  return time_str
}

export async function sleep(time: number) {
  return new Promise<void>(resolve => { setTimeout(() => { resolve() }, time) })
}
