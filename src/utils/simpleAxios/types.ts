export type RequestOptions = UniApp.RequestOptions

export type RequestTask = UniApp.RequestTask

export interface RequestSuccessCallbackResult<T extends string | Record<string, any> | ArrayBuffer> {
  /** 开发者服务器返回的数据 */
  data: T
  /** 开发者服务器返回的 HTTP 状态码 */
  statusCode: number
  /** 开发者服务器返回的 HTTP Response Header */
  header: any
  /** 开发者服务器返回的 cookies，格式为字符串数组 */
  cookies: string[]
}

export interface DefaultConfig extends Omit<RequestOptions, 'url' | 'success' | 'fail' | 'complete'>{
  /** 请求服务器地址 */
  baseURL?: string
  /** 自定义请求方法 */
  adapter?: (config: RequestConfig) => Promise<Response<string | Record<string, any> | ArrayBuffer>>
}

export interface RequestConfig extends Omit<RequestOptions, 'success' | 'fail'>{
  /** 请求服务器地址 */
  baseURL?: string
  /**
   * 获取requestTask，可中断请求任务。
   * 需要至少传入 success / fail / complete 参数中的一个,如果没有传入 success / fail / complete 参数，则会返回封装后的 Promise 对象
   * */
  getRequestTask?: (task: RequestTask) => void
}

export interface Response<
  TResult extends string | Record<string, any> | ArrayBuffer
> extends RequestSuccessCallbackResult<TResult> {}

export interface InterceptorsHandler<TValue> {
  fulfilled: ((value: TValue) => string | Record<string, any> | ArrayBuffer) | null
  rejected: ((error: any) => any) | null
}
