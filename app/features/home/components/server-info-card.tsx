import { CloudIcon, FileTextIcon, ServerIcon, StarIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useLandingIndexLoaderData } from "~/routes/_landing._index"

export default function ServerInfoCard() {
  const { requestId, valueFromCloudflare, text, numbers } =
    useLandingIndexLoaderData()

  const items = [
    {
      icon: ServerIcon,
      title: "Request Id from Hono context",
      value: requestId,
      className: "text-blue-500",
    },
    {
      icon: CloudIcon,
      title: "Cloudflare Variable",
      value: valueFromCloudflare,
      className: "text-orange-500",
    },
    {
      icon: FileTextIcon,
      title: "Server Loader Data",
      value: text,
      className: "text-green-500",
    },
    {
      icon: StarIcon,
      title: "Random Number from external API",
      value: numbers.join(", "),
      className: "text-yellow-500",
    },
  ]

  return (
    <section className="w-full bg-gradient-to-br from-purple-50 to-blue-50 py-12 dark:from-gray-900 dark:to-gray-800 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Server Information
          </h2>
          <p className="mt-4 max-w-[600px] text-gray-500 dark:text-gray-400">
            Real-time server data and runtime information
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.title}
              className="border-none shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <item.icon className={`size-6 ${item.className}`} />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {item.title === "Stars" ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: Number(item.value) }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="flex size-8 items-center justify-center rounded-md bg-yellow-100 font-mono text-sm text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          ★
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="font-mono text-sm text-gray-600 dark:text-gray-300">
                    {String(item.value)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
