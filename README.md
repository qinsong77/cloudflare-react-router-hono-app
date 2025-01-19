# Cloudflare React-router7 Hono App

crated by `pnpm dlx create-react-router@latest --template remix-run/react-router-templates/cloudflare-d1`

Check [https://rrv7-hono-app.wakershadow.workers.dev/](https://rrv7-hono-app.wakershadow.workers.dev/) for demo

## Features

- Enable Cloudflare Workers, D1 and KV work with Hono server, react router and server all on local well, powered by this `getPlatformProxy` from wrangler, refer [dev-platform middleware](./server/middleware/dev-platform.ts)
- No extra vite packages for local development, totally self-control, check the [server.js](./server.js)
- Hono
- React Router 7
- Cloudflare works, D1 and KV
- Drizzle orm with D1

Because of the connection between Hono and rrv7, that means we can pass the Hono Context,
what we can get in Hono server, we can pass it to React Router loader easily.

## Getting Started

- `pnpm install`
- Refer to `wrangler.example.toml` and create `wrangler.toml`, add yourself config; Refer to `.env.example` and create `.env`,
- `pnpm run db:generate`
- `pnpm run db:migrate-local`
- `pnpm run dev`

---

# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Run an initial database migration:

```bash
npm run db:migrate
```

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To deploy directly to production:

```sh
npx wrangler deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
