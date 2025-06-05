"use client";

import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import axios from "axios";
import { getDashboardColumns } from "./columns";
import { DataTableWrapper } from "@/components/table/data-table-wrapper";
import { Option } from "@/components/table/types";
import { DataTableFilter } from "@/components/table/data-table-filter";
import { DataTableToolbarSkeleton } from "@/components/table/skeleton/data-table-toolbar-skeleton";
import { DataTableSkeleton } from "@/components/table/skeleton/data-table-skeleton";

const searchParams = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  gender: parseAsString.withDefault(""),
};

function getGenders() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Others", value: "others" },
      ]);
    }, 2000);
  });
}

export function DataTableView() {
  const [params] = useQueryStates(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["test", params],
    queryFn: () =>
      axios.get("https://67eb9e33aa794fb3222ae85f.mockapi.io/api/v1/users", {
        params: {
          page: params.page,
          limit: params.perPage,
          name: params.name,
          gender: params.gender,
        },
      }),
  });

  const { data: genderData, isLoading: isGenderLoading } = useQuery({
    queryKey: ["genders"],
    queryFn: getGenders,
  });

  const { data: total } = useQuery({
    queryKey: ["test", params.name, params.gender],
    queryFn: () =>
      axios.get("https://67eb9e33aa794fb3222ae85f.mockapi.io/api/v1/users", {
        params: { name: params.name, gender: params.gender },
      }),
  });

  const pageCount = Math.ceil((total?.data.length ?? 0) / params.perPage);

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: data?.data ?? [],
    columns: getDashboardColumns({
      genderOptions: genderData as Option[],
    }),
    throttleMs: 1000,
    pageCount,
    clearOnDefault: true,
  });

  if (isGenderLoading) {
    return (
      <div className="space-y-2">
        <DataTableToolbarSkeleton />
        <DataTableSkeleton columnCount={table.getVisibleFlatColumns().length} />
      </div>
    );
  }

  return (
    <DataTableWrapper>
      <DataTableFilter
        table={table}
        shallow={shallow}
        debounceMs={debounceMs}
        throttleMs={throttleMs}
      />
      <DataTable table={table} isLoading={isLoading || isGenderLoading} />
    </DataTableWrapper>
  );
}
