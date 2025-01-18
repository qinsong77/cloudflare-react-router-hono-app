import { reactRouter } from "@react-router/dev/vite"
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare"
import autoprefixer from "autoprefixer"
import tailwindcss from "tailwindcss"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    target: isSsrBuild ? "ES2022" : "modules",
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : undefined,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  // ssr: {
  //   target: "webworker",
  //   noExternal: true,
  //   external: ["node:async_hooks", "lightningcss"],
  //   resolve: {
  //     conditions: ["workerd", "browser"],
  //   },
  //   optimizeDeps: {
  //     include: [
  //       "react",
  //       "react/jsx-runtime",
  //       "react/jsx-dev-runtime",
  //       "react-dom",
  //       "react-dom/server",
  //       "react-router",
  //     ],
  //   },
  // },
  plugins: [
    cloudflareDevProxy(), // TODO wired, need this otherwise it dev server will break with: https://github.com/remix-run/react-router/issues/12302#issuecomment-2497040944
    reactRouter(),
    tsconfigPaths(),
  ],
}))
