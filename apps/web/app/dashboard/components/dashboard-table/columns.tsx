import { DataTableColumnHeader } from "@/components/table/data-column-header";
import { Text } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface Props {
  genderOptions: { value: string; label: string }[];
}

export function getDashboardColumns({
  genderOptions,
}: Props): ColumnDef<any>[] {
  return [
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
        options: genderOptions?.map((option) => ({
          label: option.label,
          value: option.value,
        })),
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
  ];
}
