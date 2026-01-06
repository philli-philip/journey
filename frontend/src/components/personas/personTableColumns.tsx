import type { Persona } from "@shared/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ActionCell } from "./personaTableCells";

export const usePersonaColumns = (): ColumnDef<Persona>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ActionCell,
  },
];
