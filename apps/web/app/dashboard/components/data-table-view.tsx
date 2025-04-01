"use client";

import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

export function DataTableView() {
  const { table } = useDataTable({
    data: [],
    columns: [],
    pageCount: 0,
  });

  return (
    <div>
      <DataTable table={table} />
    </div>
  );
}
