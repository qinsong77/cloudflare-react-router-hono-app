import type { Config } from 'drizzle-kit'

export default {
  out: './migration/sqlite',
  schema: './server/d1/schema/**.sql.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_TOKEN!,
  },
} satisfies Config
