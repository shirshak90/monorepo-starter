"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { Text } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import axios from "axios";
import { DataTableColumnHeader } from "@/components/table/data-column-header";

const searchParams = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  gender: parseAsString.withDefault(""),
};

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

  const { data: total } = useQuery({
    queryKey: ["test", params.name, params.gender],
    queryFn: () =>
      axios.get("https://67eb9e33aa794fb3222ae85f.mockapi.io/api/v1/users", {
        params: { name: params.name, gender: params.gender },
      }),
  });

  const pageCount = Math.ceil((total?.data.length ?? 0) / params.perPage);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns: [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"Name"} />
        ),
        meta: {
          label: "Name",
          placeholder: "Search...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        id: "gender",
        accessorKey: "gender",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"Gender"} />
        ),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.gender}</span>
        ),
        meta: {
          label: "Gender",
          variant: "select",
          options: genderOptions.map((option) => ({
            label: option.label,
            value: option.value,
          })),
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
    ],
    throttleMs: 1000,
    pageCount,
  });

  return (
    <div>
      <DataTable table={table}>
        <DataTableToolbar table={table}></DataTableToolbar>
      </DataTable>
    </div>
  );
}
