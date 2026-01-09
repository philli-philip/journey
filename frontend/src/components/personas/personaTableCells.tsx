import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import type { Persona } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { deletePersona } from "@/api/personas";
import { imageURI } from "@/lib/utils";

export const ActionCell = ({ row }: { row: Row<Persona> }) => {
  const persona = row.original;
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
          onClick={async (e) => {
            e.stopPropagation();
            await deletePersona(persona.slug);
            queryClient.invalidateQueries({
              queryKey: ["personas"],
            });
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AvatarCell = ({ row }: { row: Row<Persona> }) => {
  const { imageId } = row.original;

  return (
    <span className="flex flex-row gap-2 items-center">
      {imageId ? (
        <img src={imageURI(imageId)} className="size-6 rounded-full" />
      ) : (
        <div className="size-6 rounded-full bg-stone-100" />
      )}
      <span className="font-medium">{row.original.name}</span>
    </span>
  );
};
