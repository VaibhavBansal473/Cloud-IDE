import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 8, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="grid gap-3 border-b p-4 sm:grid-cols-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-24" />
        ))}
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-3 p-4 sm:grid-cols-4 sm:items-center"
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={
                  columnIndex === 0 ? "h-5 w-3/4" : "h-5 w-24 sm:justify-self-end"
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
