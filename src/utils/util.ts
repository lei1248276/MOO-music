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
