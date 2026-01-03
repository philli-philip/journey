import type { Persona } from "@shared/types";
import type { ColumnDef } from "@tanstack/react-table";

export const usePersonaColumns = (): ColumnDef<Persona>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
];
