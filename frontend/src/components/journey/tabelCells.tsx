import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { UserJourney } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { deleteJourney } from "@/api/journeys";

export const ActionCell = ({ row }: { row: Row<UserJourney> }) => {
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
};