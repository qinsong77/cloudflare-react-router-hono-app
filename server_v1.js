import { serve } from "@hono/node-server"

const PORT = Number.parseInt(process.env.PORT || "3000")

console.log("Starting development server")

const viteDevServer = await import("vite").then((vite) =>
  vite.createServer({
    server: { middlewareMode: true },
  })
)

const { default: app } = await viteDevServer.ssrLoadModule("./server/app.ts")

/**
 * this wont work, because the react router middleware will be mounted before vite middleware,
 * the client resource bundle by vite, in this case, vite middleware will never be reached after react router middleware
 * so the client resource will be 404
 */

// refer: https://github.com/Blankeos/hono-vike-websockets/blob/main/hono-entry.ts
app.use(async (c, next) => {
  try {
    const viteDevMiddleware = () =>
      new Promise((resolve) => {
        viteDevServer.middlewares(c.env.incoming, c.env.outgoing, () =>
          resolve()
        )
      })
    await viteDevMiddleware()
    await next()
  } catch (error) {
    console.log("error")
    console.error(error)
    if (typeof error === "object" && error instanceof Error) {
      viteDevServer.ssrFixStacktrace(error)
    }
    await next(error)
  }
})

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (c) => {
    console.log(c)
    console.log(`Server is running on http://localhost:${PORT}`)
  }
)
