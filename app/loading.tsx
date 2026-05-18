import { Card, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </header>

          <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col sm:flex-row overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-[150px]">
                <div className="w-full sm:w-48 aspect-video sm:aspect-square flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                <div className="flex-1">
                  <CardHeader className="h-full flex flex-col justify-center space-y-3">
                    <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </CardHeader>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
