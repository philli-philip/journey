import { type ColumnDef } from "@tanstack/react-table";
import { type UserJourney } from "@shared/types";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteJourney, restoreJourney } from "@/api/journeys";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const columns: ColumnDef<UserJourney>[] = [
  {
    accessorKey: "name",
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
    accessorKey: "steps",
    header: "Steps",
    cell: ({ row }) => {
      const journey = row.original;
      return <div>{journey.steps.length}</div>;
    },
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
      const formattedDate = date.toLocaleDateString();
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
      const formattedDate = date.toLocaleDateString();
      return <div className="text-secondary-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const journey = row.original;
      const queryClient = useQueryClient();

      const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteJourney(id),
        onSuccess: (data: { id: string }) => {
          queryClient.invalidateQueries({ queryKey: ["journeys"] });
          toast("Journey deleted.", {
            action: {
              label: "Undo",
              onClick: async () => {
                await restoreJourney(data.id);
                queryClient.invalidateQueries({ queryKey: ["journeys"] });
                toast("Journey restored.");
              },
            },
          });
        },
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="z-10">
            <Button variant="ghost" asChild>
              <div>
                <span className="sr-only">actions</span>
                <MoreVerticalIcon size={12} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={async (event) => {
                event.preventDefault();
                deleteMutation.mutate(journey.id);
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
