import { Column, Table } from "@tanstack/react-table";
import { PopoverContent } from "@workspace/ui/components/popover";
import { useQueryState } from "nuqs";
import React from "react";
import { ExtendedColumnFilter } from "./types";
import { getFiltersStateParser } from "./parsers";

const FILTERS_KEY = "filters";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface DataTableFilterListProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  shallow?: boolean;
}

export function DataTableAdvanceFilter<TData>({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
  ...props
}: DataTableFilterListProps<TData>) {
  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter((column) => column.columnDef.enableColumnFilter);
  }, [table]);

  const [filters, setFilters] = useQueryState(
    FILTERS_KEY,
    getFiltersStateParser<TData>(columns.map((field) => field.id))
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow,
        throttleMs,
      })
  );

  const debouncedSetFilters = setFilters;

  const onFilterUpdate = (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => {
    debouncedSetFilters((prevFilters) => {
      const updatedFilters = prevFilters.map((filter) => {
        if (filter.filterId === filterId) {
          return { ...filter, ...updates } as ExtendedColumnFilter<TData>;
        }
        return filter;
      });
      return updatedFilters;
    });
  };

  const onFilterRemove = (filterId: string) => {
    const updatedFilters = filters.filter(
      (filter) => filter.filterId !== filterId
    );
    void setFilters(updatedFilters);
  };

  const onFiltersReset = () => {
    setFilters(null);
  };

  return (
    <div>
      {columns.map((column) => (
        <DataTableToolbarFilter key={column.id} column={column} />
      ))}
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
  filters?: ExtendedColumnFilter<TData>[];
}

function DataTableToolbarFilter<TData>({
  column,
  filters,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  if (!columnMeta?.variant) return null;

  switch (columnMeta.variant) {
    case "text":
      return null;
    case "select":
      return null;
    default:
      return null;
  }
}
