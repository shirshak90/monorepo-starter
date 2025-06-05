export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  filterVariants: [
    "text",
    "number",
    "range",
    "date",
    "dateRange",
    "boolean",
    "select",
    "multiSelect",
  ] as const,
  filterOperators: ["like", "eq", "gt", "lt", "gte", "lte"] as const,
};
