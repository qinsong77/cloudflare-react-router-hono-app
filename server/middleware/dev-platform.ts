import type { MiddlewareHandler } from "hono"

import type { AppType } from "../type/hono"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let devPlatform: any

export const setupDevPlatform = (): MiddlewareHandler<AppType> => {
  return async (c, next) => {
    if (!devPlatform) {
      const { getPlatformProxy } = await import("wrangler")
      devPlatform = await getPlatformProxy({
        persist: true,
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    c.env = devPlatform.env
    await next()
  }
}

export const disposeDevPlatform = async () => {
  if (devPlatform) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await devPlatform.dispose()
    devPlatform = undefined
  }
}
