import { Skeleton } from "./ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-7 shadow-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Recent Files Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-7 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Files List */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="group relative flex overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex flex-1 p-4">
                    <Skeleton className="mr-4 h-14 w-14 rounded-lg" />

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-12 rounded-full mb-1" />
                          <Skeleton className="h-5 w-32 mb-1" />
                          <div className="mt-1 flex items-center gap-3">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-12 rounded-full" />
                          </div>
                        </div>
                        <Skeleton className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Dropdown menu skeleton */}
                  <div className="absolute right-2 top-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          {/* Storage Stats */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="p-6 pt-0">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
                <div className="space-y-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
