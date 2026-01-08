import type { Persona } from "@shared/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ActionCell, AvatarCell } from "./personaTableCells";

export const usePersonaColumns = (): ColumnDef<Persona>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: AvatarCell,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ActionCell,
  },
];
