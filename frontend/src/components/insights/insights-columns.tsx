import type { Insight } from "@shared/types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { deleteInsight } from "@/api/insights";
import { useQueryClient } from "@tanstack/react-query";
import { InsightIcon } from "./insight-icons";

export const getColumns = (
  query: ReturnType<typeof useQueryClient>
): ColumnDef<Insight>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const insight = row.original;
      return <div className="font-semibold">{insight.title}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const insight = row.original;
      return (
        <div className="flex items-center gap-2">
          <InsightIcon type={insight.type} size="16" />
          <span className=" capitalize">{insight.type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const insight = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="z-10">
            <Button
              variant="ghost"
              size="icon-sm"
              asChild
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
              className="cursor-pointer "
              onClick={async (event) => {
                event.preventDefault();
                await deleteInsight(insight.id);
                query.invalidateQueries({ queryKey: ["insights"] });
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
