import type { ColumnDef } from "@tanstack/react-table";

export type Insight = {
  id: string;
  title: string;
  description: string;
};

export const getColumns = (): ColumnDef<Insight>[] => {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },
  ];
};
