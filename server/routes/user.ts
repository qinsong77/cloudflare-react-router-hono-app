import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { getDrizzleD1Client } from '../d1/getDrizzleD1Client'
import { authMiddleware } from '../middleware/auth'
import type { AuthAppType } from '../type/hono'

const app = new Hono<AuthAppType>()
  .use('*', authMiddleware)
  .get('/profile', async (c) => {
    const userInfo = c.get('userInfo')
    const user = await getDrizzleD1Client().query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userInfo.id),
      columns: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        lastSignInAt: true,
        passwordHash: false,
      },
    })

    if (!user) {
      throw new HTTPException(404, { message: 'User not found' })
    }

    return c.json(user)
  })

export default app
