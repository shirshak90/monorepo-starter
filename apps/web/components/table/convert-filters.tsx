type Filter = {
  id: string;
  value: string | string[];
  operator: string;
};

export function convertFilters(
  filters: Filter[]
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  filters.forEach((filter, index) => {
    result[`filters[${index}][column]`] = filter.id;
    result[`filters[${index}][operator]`] = filter.operator;
    result[`filters[${index}][value]`] = filter.value;
  });

  return result;
}
