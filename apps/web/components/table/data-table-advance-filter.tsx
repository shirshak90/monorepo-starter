import { Column, Table } from "@tanstack/react-table";
import { PopoverContent } from "@workspace/ui/components/popover";
import { useQueryState } from "nuqs";
import React from "react";
import { ExtendedColumnFilter } from "./types";
import { getFiltersStateParser } from "./parsers";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";

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
    id: string,
    updates: Partial<ExtendedColumnFilter<TData>>
  ) => {
    debouncedSetFilters((prevFilters) => {
      const existingFilter = prevFilters.find((filter) => filter.id === id);

      if (!existingFilter) {
        // Add new filter
        return [
          ...prevFilters,
          { id, ...updates } as ExtendedColumnFilter<TData>,
        ];
      }

      // Update existing filter
      return prevFilters.map((filter) =>
        filter.id === id
          ? ({ ...filter, ...updates } as ExtendedColumnFilter<TData>)
          : filter
      );
    });
  };

  const onFilterRemove = (id: string) => {
    const updatedFilters = filters.filter((filter) => filter.id !== id);
    void setFilters(updatedFilters);
  };

  const onFiltersReset = () => {
    setFilters(null);
    table.resetColumnFilters();
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {columns.map((column) => (
        <DataTableToolbarFilter
          key={column.id}
          column={column}
          onFilterUpdate={onFilterUpdate}
        />
      ))}
      {!!filters.length && (
        <Button
          aria-label="Reset filters"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={onFiltersReset}
        >
          <X />
          Reset
        </Button>
      )}
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
  filters?: ExtendedColumnFilter<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
}

function DataTableToolbarFilter<TData>({
  column,
  filters,
  onFilterUpdate,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const match = filters?.find((filter) => filter.id === column.id);

  if (!columnMeta?.variant) return null;

  switch (columnMeta.variant) {
    case "text":
      return (
        <Input
          placeholder={columnMeta.placeholder ?? columnMeta.label}
          defaultValue={match?.value ?? ""}
          onChange={(e) =>
            onFilterUpdate(column.id, {
              id: column.id as Extract<keyof TData, string>,
              value: e.target.value,
              operator: columnMeta.operator?.[0],
            })
          }
          className="h-8 w-40 lg:w-56 focus-visible:ring-0"
        />
      );
    case "select":
      return null;
    default:
      return null;
  }
}
