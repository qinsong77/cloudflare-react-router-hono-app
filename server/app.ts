import { drizzle } from "drizzle-orm/d1"
import { Hono } from "hono"
import { contextStorage } from "hono/context-storage"
import { getCookie } from "hono/cookie"
import { logger } from "hono/logger"
import { requestId } from "hono/request-id"
import { type ServerBuild, createRequestHandler } from "react-router"

import * as schema from "~server/d1/schema"
import type { User } from "~server/d1/schema"

import { disposeDevPlatform, setupDevPlatform } from "./middleware/dev-platform"
// import { authMiddleware } from "~server/middleware/auth"

import auth from "./routes/auth"
import authors from "./routes/authors"
import books from "./routes/books"
import user from "./routes/user"
import { type AppType } from "./type/hono"

const app = new Hono<AppType>()

if (process.env.NODE_ENV === "development") {
  app.use(setupDevPlatform())

  process.on("SIGINT", async () => {
    await disposeDevPlatform()
    process.exit(0)
  })
}

app.use(contextStorage())

app.use("*", (c, next) => {
  if (/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)($|\?)/.exec(c.req.path)) {
    return next()
  }
  return requestId()(c, next)
})

app.use(async (c, next) => {
  const drizzleClient = drizzle(c.env.DB, { schema })
  c.set("drizzle", drizzleClient)
  await next()
})

app.use("/api/*", logger())

// access the url directly will receive 401, but click the menu can access
// app.use("/about", authMiddleware)

// refer: https://hono.dev/docs/guides/rpc#using-rpc-with-larger-applications
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .basePath("/api")
  .route("/auth", auth)
  .route("/user", user)
  .route("/authors", authors)
  .route("/books", books)

  .get("/randomnumberapi", async (c) => {
    const res = await fetch(
      "http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5"
    )
    const data: number[] = await res.json()
    return c.json(data)
  })

declare module "react-router" {
  // We can add more properties to AppLoadContext what we injected from below middleware
  interface AppLoadContext {
    requestId: string
    VALUE_FROM_CLOUDFLARE: string
    userInfo: Omit<User, "passwordHash"> | null
  }
}

app.use(async (c) => {
  // @ts-expect-error - virtual module provided by React Router at build time
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const build: ServerBuild = await import("virtual:react-router/server-build")
  const requestHandler = createRequestHandler(build, process.env.NODE_ENV)

  const sessionId = getCookie(c, "sessionId")

  let userInfo: Omit<User, "passwordHash"> | null = null

  if (sessionId) {
    const res = await c.env.KV.get(`session:${sessionId}`)

    if (res) {
      try {
        userInfo = JSON.parse(res) as User
      } catch (e) {
        console.error(e)
      }
    }
  }

  return await requestHandler(c.req.raw, {
    requestId: c.get("requestId"),
    VALUE_FROM_CLOUDFLARE: c.env.VALUE_FROM_CLOUDFLARE,
    userInfo,
  })
})

export type AppClientType = typeof routes
export default app
