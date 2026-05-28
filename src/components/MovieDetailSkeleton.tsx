import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Title + meta */}
        <Skeleton className="mb-2 h-9 w-64" />
        <Skeleton className="mb-6 h-4 w-48" />

        {/* Poster + backdrop row */}
        <div className="mb-6 flex gap-4">
          <Skeleton className="h-[220px] w-[150px] shrink-0 rounded-xl" />
          <Skeleton className="h-[220px] flex-1 rounded-xl" />
        </div>

        {/* Genre tags */}
        <div className="mb-4 flex gap-2">
          {[80, 100, 72, 90, 78].map((w, i) => (
            <Skeleton
              key={i}
              className="h-7 rounded-full"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* Overview */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-6 h-4 w-3/4" />

        {/* Director / Writers / Stars */}
        <div className="space-y-4 border-t border-border pt-4">
          {["Director", "Writers", "Stars"].map((label) => (
            <div key={label} className="flex gap-4">
              <Skeleton className="h-4 w-16 shrink-0" />
              <Skeleton className="h-4 w-56" />
            </div>
          ))}
        </div>

        {/* More like this */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-[200px] w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
