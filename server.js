// refer https://github.com/remix-run/react-router-templates/blob/main/node-custom-server/server.js
import { serve } from "@hono/node-server"
import { Hono } from "hono"

const PORT = Number.parseInt(process.env.PORT || "3000")

console.log("Starting development server")

const devApp = new Hono()

const viteDevServer = await import("vite").then((vite) =>
  vite.createServer({
    server: { middlewareMode: true },
    appType: "custom",
  })
)

// we must mounted vite server first, then mount app for react router, put it in the last, otherwise client resource will be 404
// refer: https://github.com/Blankeos/hono-vike-websockets/blob/main/hono-entry.ts
devApp.use(async (c, next) => {
  const viteDevMiddleware = () =>
    new Promise((resolve) => {
      viteDevServer.middlewares(c.env.incoming, c.env.outgoing, () => resolve())
    })
  await viteDevMiddleware()
  await next()
})

devApp.use(async (c) => {
  try {
    const { default: app } =
      await viteDevServer.ssrLoadModule("./server/app.ts")

    const response = await app.fetch(c.req.raw)
    return response
  } catch (error) {
    console.error(error)
    if (typeof error === "object" && error instanceof Error) {
      viteDevServer.ssrFixStacktrace(error)
    }
    throw error
  }
})

serve(
  {
    fetch: devApp.fetch,
    port: PORT,
  },
  (c) => {
    console.log(`Server is running on http://localhost:${PORT}`)
  }
)
