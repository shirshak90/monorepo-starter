import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { DataTableToolbarSkeleton } from "./data-table-toolbar-skeleton";
import { DataTablePaginationSkeleton } from "./data-table-pagination-skeleton";

interface DataTableSkeletonProps {
  columnCount: number;
}

export function DataTableSkeleton({ columnCount }: DataTableSkeletonProps) {
  return (
    <div className="flex w-full flex-col gap-2.5 overflow-auto h-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableHead key={`header-skeleton-${colIndex}`}>
                  <Skeleton className="h-4 w-24 rounded-sm" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {Array.from({ length: columnCount }).map((_, cellIndex) => (
                  <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                    <Skeleton className="h-5 w-full rounded-sm" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2.5">
        <DataTablePaginationSkeleton />
      </div>
    </div>
  );
}
