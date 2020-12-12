import config from 'config'

export const getKey = (key: string): string =>
  process.env.NODE_ENV === 'production' ? (process.env[key] as string) : config.get(key)
