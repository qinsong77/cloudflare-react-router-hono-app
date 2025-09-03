import type { Config } from 'drizzle-kit'

export default {
  out: './migration/sqlite',
  schema: './server/d1/**.sql.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
} satisfies Config
