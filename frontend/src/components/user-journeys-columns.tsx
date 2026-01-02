import { type ColumnDef } from "@tanstack/react-table";
import { type UserJourney } from "@shared/types";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { deleteJourney } from "@/api/journeys";

export const getColumns = (): ColumnDef<UserJourney>[] => [
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
    cell: ({ row }) => {
      const journey = row.original;
      const queryClient = useQueryClient();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="z-10">
            <Button
              variant="ghost"
              asChild
              size="icon-sm"
              className="border-transparent hover:border-border border cursor-pointer"
            >
              <div>
                <span className="sr-only">actions</span>
                <MoreVerticalIcon size={12} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                deleteJourney(journey.id);
                queryClient.invalidateQueries({
                  queryKey: ["journeys"],
                });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
