import type { Insight } from "@shared/types";
import type { ColumnDef } from "@tanstack/react-table";

export const getColumns = (): ColumnDef<Insight>[] => {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },
  ];
};
