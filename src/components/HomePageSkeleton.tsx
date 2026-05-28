import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Carousel skeleton */}
      <section className="w-full px-6 py-8">
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      </section>

      {/* Movie groups */}
      <section className="mx-auto max-w-7xl space-y-14 px-6 pb-20">
        {["Now Playing", "Upcoming", "Popular", "Top Rated"].map((group) => (
          <div key={group}>
            {/* Group header */}
            <div className="mb-5 flex items-center justify-between">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
            {/* Cards */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => i).map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <Skeleton className="h-[300px] w-full rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
