import { type ColumnDef } from "@tanstack/react-table";
import { type UserJourney } from "@shared/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionCell } from "./journey/tabelCells";

export const useJourneyColumns = (): ColumnDef<UserJourney>[] => [
  {
    accessorKey: "name",
    minSize: 80,
    size: 200,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const journey = row.original;
      return <div className="font-semibold">{journey.name}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString(navigator.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="text-secondary-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      const formattedDate = date.toLocaleDateString(navigator.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="text-secondary-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 1,
    meta: {
      style: {
        textAlign: "right",
      },
    },
    cell: ActionCell,
  },
];
