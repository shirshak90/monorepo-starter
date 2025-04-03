import { Skeleton } from "@workspace/ui/components/skeleton";

export function DataTableToolbarSkeleton() {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2.5 flex-wrap overflow-auto">
        <Skeleton className="w-48 h-7" />
        <Skeleton className="w-40 h-7" />
        <Skeleton className="w-40 h-7" />
      </div>
      <Skeleton className="w-28 h-7" />
    </div>
  );
}
