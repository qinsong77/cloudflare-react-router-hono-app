import { zValidator } from '@hono/zod-validator'
import { eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

import { getDrizzleD1Client } from '../d1/getDrizzleD1Client'
import { users as usersSchema } from '../d1/user.sql'
import { type AuthAppType } from '../type/hono'
import { generateSessionId, hashPassword, verifyPassword } from '../utils/auth'

const SESSION_DURATION = 7 * 24 * 60 * 60
const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(2, 'Password must be at least 2 characters'),
  // .min(3, "Password must be at least 8 characters")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(
  //   /[^A-Za-z0-9]/,
  //   "Password must contain at least one special character"
  // ),
})

const app = new Hono<AuthAppType>()
  .post('/register', zValidator('json', registerSchema), async (c) => {
    try {
      const { email, password } = c.req.valid('json')

      const hashedPassword = await hashPassword(password)
      const [user] = await getDrizzleD1Client()
        .insert(usersSchema)
        .values({
          email,
          passwordHash: hashedPassword,
        })
        .returning({
          id: usersSchema.id,
          email: usersSchema.email,
          createdAt: usersSchema.createdAt,
          updatedAt: usersSchema.updatedAt,
          lastSignInAt: usersSchema.lastSignInAt,
        })

      const sessionId = generateSessionId()
      await c.env.KV.put(
        `session:${sessionId}`,
        JSON.stringify({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastSignInAt: user.lastSignInAt,
        }),
        {
          expiration: Math.floor(Date.now() / 1000) + SESSION_DURATION,
        },
      )

      setCookie(c, 'sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: SESSION_DURATION,
      })

      return c.json(
        { message: 'User registered successfully', success: true },
        201,
      )
    } catch (error) {
      throw new HTTPException(400, {
        message: 'Registration failed',
        cause: error,
      })
    }
  })
  .post(
    '/login',
    zValidator(
      'json',
      z.object({
        email: z.email('Invalid email address'),
        password: z.string(),
      }),
    ),
    async (c) => {
      const { email, password } = c.req.valid('json')

      const user = await getDrizzleD1Client().query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      })

      if (!user) {
        throw new HTTPException(401, { message: 'Invalid credentials' })
      }

      const isValid = await verifyPassword(password, user.passwordHash)
      if (!isValid) {
        throw new HTTPException(401, { message: 'Password is incorrect' })
      }

      await getDrizzleD1Client()
        .update(usersSchema)
        .set({
          lastSignInAt: sql`(unixepoch())`,
        })
        .where(eq(usersSchema.id, user.id))

      const sessionId = generateSessionId()

      await c.env.KV.put(
        `session:${sessionId}`,
        JSON.stringify({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastSignInAt: new Date().getTime() / 1000,
        }),
        {
          expiration: Math.floor(Date.now() / 1000) + SESSION_DURATION,
        },
      )

      setCookie(c, 'sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: SESSION_DURATION,
      })

      return c.json({ message: 'Login successful' })
    },
  )
  .post('/logout', async (c) => {
    const sessionId = getCookie(c, 'sessionId')
    if (sessionId) {
      await c.env.KV.delete(`session:${sessionId}`)
      setCookie(c, 'sessionId', '', { maxAge: 0 })
    }
    return c.json({ message: 'Logged out successfully' })
  })

export default app
