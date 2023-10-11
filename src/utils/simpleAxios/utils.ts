export function isExternal(url: string) {
  return /^(https?:)/.test(url)
}

export function extend(context: Record<string, any>, source: Record<string, any>) {
  const exclude = ['constructor']
  const keys = Object.getOwnPropertyNames(source).filter((v) => !exclude.includes(v))

  keys.forEach((key) => {
    const value = source[key]
    context[key] = typeof value === 'function' ? value.bind(context) : value
  })

  return context
}
