import type {
  DefaultConfig,
  RequestConfig,
  Response,
  InterceptorsHandler
} from './types'
import {
  isExternal,
  extend
} from './utils'

class SimpleAxios {
  defaults: DefaultConfig
  interceptors
  constructor(instanceConfig: DefaultConfig) {
    this.defaults = instanceConfig
    this.interceptors = {
      request: new Interceptors<RequestConfig>(),
      response: new Interceptors<Response<any>>()
    }
  }

  request<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(config: RequestConfig): Promise<R> {
    config = { ...this.defaults, ...config }
    config.url = isExternal(config.url) ? config.url : config.baseURL + config.url

    const chain: [
      InterceptorsHandler<any>['fulfilled'] | null,
      InterceptorsHandler<any>['rejected'] | null
    ] = [this.defaults?.adapter || dispatchRequest, null]

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })

    let promise: Promise<any> = Promise.resolve(config)
    let i = 0
    while (i < chain.length) {
      promise = promise.then(chain[i++], chain[i++])
    }

    return promise as Promise<R>
  }

  // #ifndef APP-PLUS
  options<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', config: Omit<RequestConfig, 'url'> = {}) {
    return this.request<T, R>({ method: 'OPTIONS', url, ...config })
  }
  // #endif

  get<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', config: Omit<RequestConfig, 'url'> = {}) {
    return this.request<T, R>({ method: 'GET', url, ...config })
  }

  head<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', config: Omit<RequestConfig, 'url'> = {}) {
    return this.request<T, R>({ method: 'HEAD', url, ...config })
  }

  post<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', data?: Record<string, any>, config: Omit<RequestConfig, 'url'> = {}) {
    return this.request<T, R>({ method: 'POST', url, data, ...config })
  }

  put<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', data?: Record<string, any>, config: Omit<RequestConfig, 'url' | 'data'> = {}) {
    return this.request<T, R>({ method: 'PUT', url, data, ...config })
  }

  delete<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', config: Omit<RequestConfig, 'url'> = {}) {
    return this.request<T, R>({ method: 'DELETE', url, ...config })
  }

  trace<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', config: Omit<RequestConfig, 'url'> = {}) {
    return this.request<T, R>({ method: 'TRACE', url, ...config })
  }

  // #ifndef APP-PLUS
  connect<
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(url = '', config: Omit<RequestConfig, 'url'> = {}) {
    return this.request<T, R>({ method: 'CONNECT', url, ...config })
  }
  // #endif
}
class Interceptors<TValue> {
  handlers: InterceptorsHandler<TValue>[] = []

  use(
    fulfilled: InterceptorsHandler<TValue>['fulfilled'] | null,
    rejected: InterceptorsHandler<TValue>['rejected'] | null
  ) {
    this.handlers.push({ fulfilled: fulfilled || null, rejected: rejected || null })

    return this.handlers.length - 1
  }

  eject(index: number) {
    this.handlers[index] = { fulfilled: null, rejected: null }
  }

  clear() {
    this.handlers = []
  }

  forEach(fn: (handler: InterceptorsHandler<TValue>) => void) {
    this.handlers.forEach((v) => { fn(v) })
  }
}

function dispatchRequest(config: RequestConfig): Promise<Response<string | Record<string, any> | ArrayBuffer>> {
  return new Promise((resolve, reject) => {
    const RequestTask = uni.request({
      ...config,
      success: (res) => { resolve(res) },
      fail: (err) => { reject(err) }
    })
    // ! 通过回调暴露RequestTask
    config.getRequestTask && config.getRequestTask(RequestTask)
  })
}

interface SimpleAxiosInstance extends SimpleAxios{
  <
    T extends string | Record<string, any> | ArrayBuffer,
    R = Response<T>
  >(config: RequestConfig): Promise<R>

  defaults: Omit<DefaultConfig, 'header'> & { header: Record<string, any> }
}

function createInstance(defaultConfig: DefaultConfig): SimpleAxiosInstance {
  const context = new SimpleAxios(defaultConfig)
  const instance = SimpleAxios.prototype.request.bind(context)

  return Object.assign(instance, extend(context, SimpleAxios.prototype)) as SimpleAxiosInstance
}

interface SimpleAxiosStatic extends SimpleAxiosInstance{
  create(config?: DefaultConfig): SimpleAxiosInstance
}

const globalDefaults: DefaultConfig = {
  baseURL: '',
  header: {}
}

export const simpleAxios: SimpleAxiosStatic = Object.assign(createInstance(globalDefaults), {
  create(instanceConfig?: DefaultConfig) {
    return createInstance({ ...globalDefaults, ...instanceConfig })
  }
})

export default simpleAxios
