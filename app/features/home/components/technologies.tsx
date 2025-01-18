import {
  Cog,
  Database,
  Layers,
  CodepenIcon as ReactIcon,
  Repeat,
  Server,
  Zap,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

const technologies = [
  {
    name: "Cloudflare Workers",
    description: "Serverless edge computing platform with global deployment",
    icon: Server,
  },
  {
    name: "Cloudflare KV",
    description: "Global key-value storage with ultra-low latency",
    icon: Database,
  },
  {
    name: "Cloudflare D1",
    description: "Serverless SQL database built on SQLite",
    icon: Database,
  },
  {
    name: "React 19",
    description:
      "Build user interfaces with the latest React features including use hooks",
    icon: ReactIcon,
  },
  {
    name: "Vite",
    description: "Lightning fast HMR and optimized build process",
    icon: Zap,
  },
  {
    name: "React Router 7",
    description: "Modern routing with data loading and mutations",
    icon: Repeat,
  },
  {
    name: "Hono",
    description: "Ultra-fast web framework for modern runtimes",
    icon: Cog,
  },
  {
    name: "Drizzle ORM",
    description: "Type-safe TypeScript ORM for SQLite, PostgreSQL and MySQL",
    icon: Layers,
  },
]

const Technologies = () => {
  return (
    <section className="w-full bg-gray-50 py-12 dark:bg-gray-900 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Cutting Edge Stack
          </h2>
          <p className="mt-4 max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl">
            Built with the latest technologies to ensure the best performance
            and developer experience.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech) => (
            <Card
              key={tech.name}
              className="border-none shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <tech.icon className="size-6 text-purple-500" />
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tech.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Technologies
