# Cloudflare React Router 7 Hono App

Created by `create cloudflare@latest cloudflare-react-router-hono-app -- --framework=react-router`

Refer: [Cloudflare Framework Guide - React Router (formerly Remix)](https://developers.cloudflare.com/workers/framework-guides/web-apps/react-router/)

Check [https://rrv7-hono-app.wakershadow.workers.dev/](https://rrv7-hono-app.wakershadow.workers.dev/) for demo

## [v1](https://github.com/qinsong77/cloudflare-react-router-hono-app/tree/v1)

V1 features (legacy approach):

- Enable Cloudflare Workers, D1 and KV work with Hono server, react router and server all by customer dev server and wrap customer `wrangler` locally
- No extra vite packages for local development, totally self-control, check the [dev-server.js](./dev-server.js)
- Powered by `getPlatformProxy` from wrangler, refer [dev-platform middleware](server/middleware/dev-platform.ts)

**Note**: Current version uses `@cloudflare/vite-plugin` instead of the custom dev server approach from v1.

## Features

- **Full-Stack Integration**: Seamless integration between Hono server and React Router 7
- **Cloudflare Platform**: Native support for Cloudflare Workers, D1 Database, and KV Storage
- **Modern Development**: Powered by `@cloudflare/vite-plugin` for seamless local development
- **Modern Tech Stack**:
  - React Router 7 with SSR/SSG/CSR support
  - Hono.js for high-performance server-side logic
  - Drizzle ORM with D1 database
  - TypeScript throughout the entire stack
  - Tailwind CSS with Shadcn/UI components
- **Context Sharing**: Direct access to Hono context in React Router loaders
- **Authentication**: Built-in authentication system with session management
- **Database Migrations**: Automated database schema management
- **Type Safety**: End-to-end TypeScript support with proper type generation

## Tech Stack

### Frontend

- **React Router 7** - Full-stack web framework with SSR/SSG/CSR support
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality, accessible UI components

### Backend

- **Hono.js** - Fast, lightweight web framework for Cloudflare Workers
- **Cloudflare Workers** - Serverless compute platform
- **D1 Database** - Serverless SQL database
- **KV Storage** - Global key-value storage
- **Drizzle ORM** - TypeScript ORM with excellent DX

### Development Tools

- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting
- **Wrangler** - Cloudflare Workers CLI

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Cloudflare account (for deployment)

### First-time Cloudflare Setup

If you don't have Cloudflare resources set up yet:

1. **Create a D1 database**

   ```bash
   wrangler d1 create your-database-name
   ```

2. **Create a KV namespace**

   ```bash
   wrangler kv namespace create your-kv-name
   ```

3. **Update your `wrangler.toml`** with the generated IDs and names

### Installation

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up the database**

   ```bash
   # Generate database migrations(You can delete the migrations folder to regenerate)
   pnpm run db:generate

   # Apply migrations to local D1 database(replace `DB` with your database name in script)
   pnpm run db:migrate-local
   ```

3. **Configure Cloudflare**
   - Copy `wrangler.example.jsonc` to `wrangler.jsonc`
   - Update the configuration with your Cloudflare account details:
     - Replace `your-database-name` and `your-database-id` with your D1 database details
     - Replace `your-kv-namespace-id` with your KV namespace ID
     - Update the worker name if needed

4. **Start development server**

   ```bash
   pnpm run dev
   ```

   The application will be available at `http://localhost:5173`

## Deployment

To deploy your application to Cloudflare Workers:

1. **Build and deploy**

   ```bash
   pnpm run deploy
   ```

2. **Apply database migrations to production**
   ```bash
   pnpm run db:migrate-production
   ```

The application will be deployed to your Cloudflare Workers account and accessible via your worker URL.

## Available Scripts

### Development

- `pnpm run dev` - Start development server
- `pnpm run preview` - Preview production build locally

### Database

- `pnpm run db:generate` - Generate database migrations
- `pnpm run db:migrate-local` - Apply migrations to local D1 database (replace DB with your database name)
- `pnpm run db:migrate-production` - Apply migrations to production D1 database (replace DB with your database name)

### Build & Deploy

- `pnpm run build` - Build the application for production
- `pnpm run deploy` - Build and deploy to Cloudflare Workers

### Code Quality

- `pnpm run lint` - Run ESLint
- `pnpm run lint-and-format:fix` - Fix linting and formatting issues
- `pnpm run format` - Check code formatting
- `pnpm run format:fix` - Fix code formatting
- `pnpm run typecheck` - Run TypeScript type checking

### Type Generation

- `pnpm run typegen:cf` - Generate Cloudflare Workers types

## Project Structure

```
├── app/                    # React Router 7 application
│   ├── components/         # Reusable UI components
│   ├── features/          # Feature-based modules
│   ├── routes/            # Route definitions
│   └── ...
├── server/                # Hono server application
│   ├── routes/            # API route handlers
│   ├── d1/               # Database schema and queries
│   └── middleware/       # Server middleware
├── shared/               # Shared utilities
└── migration/            # Database migrations
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
