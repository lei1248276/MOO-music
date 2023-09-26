/**
 * @description 懒加载执行函数
 */
export default function useLazyData<T extends(...args: any) => ReturnType<T>>(fn: T): { value: ReturnType<T> } {
  return {
    get value() {
      // @ts-ignore
      delete this.value
      // @ts-ignore
      return (this.value = fn())
    }
  }
}
