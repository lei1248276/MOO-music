/* eslint-disable no-redeclare */

/**
 * @description 跳转时会判断前后页面是否相同，current === to 取消跳转
 * @param url 跳转URL
 */
export default function useNavigateTo(url: string): void

/**
 * @description 跳转时会判断前后页面是否相同，current === to 取消跳转
 * @param options uni.navigateTo相同参数
 */
export default function useNavigateTo(options: Parameters<typeof uni.navigateTo>[0]): void

export default function useNavigateTo(url: string | Parameters<typeof uni.navigateTo>[0]) {
  const pages = getCurrentPages()
  // @ts-ignore // * 跳转同一页面无操作
  if (pages.length && pages.pop().$page.fullPath === (url.url || url)) return

  // @ts-ignore // * fromRoute === toRoute 直接返回
  // if (pages.length && pages.pop().$page.fullPath === (url.url || url)) return uni.navigateBack()

  uni.navigateTo(typeof url === 'string'
    ? { url, fail: (err) => { console.error(err) } }
    : url
  )
}

