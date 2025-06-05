"use client";

import React from "react";
import { Column, Table } from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { ExtendedColumnFilter } from "./types";
import { getFiltersStateParser } from "./parsers";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-advance-faceted-filter";
import { cn } from "@workspace/ui/lib/utils";
import { DataTableViewOptions } from "./data-table-view-options";

const FILTERS_KEY = "filters";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface DataTableFilterListProps<TData> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  shallow?: boolean;
}

export function DataTableFilter<TData>({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
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

      table.resetPagination();

      if (!existingFilter) {
        return [
          ...prevFilters,
          { id, ...updates } as ExtendedColumnFilter<TData>,
        ];
      }

      return prevFilters.map((filter) =>
        filter.id === id
          ? ({ ...filter, ...updates } as ExtendedColumnFilter<TData>)
          : filter
      );
    });
  };

  const onFilterRemove = (id: string) => {
    const updatedFilters = filters.filter((filter) => filter.id !== id);
    setFilters(updatedFilters);
    table.resetPagination();
  };

  const onFiltersReset = () => {
    setFilters(null);
    table.resetPagination();
  };

  return (
    <div className="flex">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter
            key={column.id}
            column={column}
            filters={filters}
            onFilterUpdate={onFilterUpdate}
            onFilterRemove={onFilterRemove}
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
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
      </div>
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
  onFilterRemove: (filterId: string) => void;
}

function DataTableToolbarFilter<TData>({
  column,
  filters,
  onFilterUpdate,
  onFilterRemove,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const match = filters?.find((filter) => filter.id === column.id);

  if (!columnMeta?.variant) return null;

  switch (columnMeta.variant) {
    case "text":
      return (
        <Input
          placeholder={columnMeta.placeholder ?? columnMeta.label}
          value={match?.value ?? ""}
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
    case "number":
      return (
        <div className="relative">
          <Input
            type="number"
            inputMode="numeric"
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={match?.value ?? ""}
            onChange={(e) =>
              onFilterUpdate(column.id, {
                id: column.id as Extract<keyof TData, string>,
                value: e.target.value,
                operator: columnMeta.operator?.[0],
              })
            }
            className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
          />
          {columnMeta.unit && (
            <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
              {columnMeta.unit}
            </span>
          )}
        </div>
      );
    case "select":
    case "multiSelect":
      return (
        <DataTableFacetedFilter
          title={columnMeta.label}
          column={column}
          options={columnMeta.options ?? []}
          filters={filters}
          multiple={columnMeta.variant === "multiSelect"}
          onFilterUpdate={onFilterUpdate}
          onFilterRemove={onFilterRemove}
        />
      );
    default:
      return null;
  }
}
