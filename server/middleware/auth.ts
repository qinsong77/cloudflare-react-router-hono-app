import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

import type { User } from '../d1/schema'
import type { AuthAppType } from '../type/hono'

export const authMiddleware = createMiddleware<AuthAppType>(async (c, next) => {
  const sessionId = getCookie(c, 'sessionId')

  if (!sessionId) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  const res = await c.env.KV.get(`session:${sessionId}`)

  if (!res) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  const userInfo = JSON.parse(res) as User
  c.set('userInfo', userInfo)
  await next()
})
