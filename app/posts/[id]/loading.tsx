export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-8" />

        <article className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm mb-8 space-y-8">
          <header className="space-y-4 border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <div className="h-12 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
          </header>

          <div className="space-y-3">
            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
          </div>

          <div className="grid gap-6">
            <div className="rounded-xl aspect-video bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          </div>
        </article>

        <section className="space-y-8">
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-8" />
            <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          </div>
        </section>
      </div>
    </div>
  );
}
