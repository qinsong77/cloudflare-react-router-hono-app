import { getContext } from 'hono/context-storage'

import type { AppType } from '../type/hono'

export const getDrizzleD1Client = () => {
  return getContext<AppType>().var.drizzle
}
