export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mx-auto" />
          <div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse mx-auto" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
              <div className="h-10 w-full bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800 animate-pulse" />
            </div>
          ))}
          <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
