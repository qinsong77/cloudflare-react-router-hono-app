import type { DrizzleD1Database } from "drizzle-orm/d1"
import type { RequestIdVariables } from "hono/request-id"

import type * as schema from "~server/d1/schema"
import type { User } from "~server/d1/schema"

type Variables = RequestIdVariables & {
  drizzle: DrizzleD1Database<typeof schema>
}

export type AppType = {
  Bindings: Env // Env refer to wrangler.toml, worker-configuration.d.ts
  Variables: Variables
}

export type AuthAppType = {
  Variables: {
    userInfo: User
  }
} & AppType
