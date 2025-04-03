import { Skeleton } from "@workspace/ui/components/skeleton";

export function DataTablePaginationSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <Skeleton className="h-7 w-32" />
      <div className="flex gap-3">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-7 w-44" />
      </div>
    </div>
  );
}
