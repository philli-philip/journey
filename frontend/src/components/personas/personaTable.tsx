import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import type { Persona } from "@shared/types";

interface DataTableProps<TData extends Persona, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: JSX.Element;
}

export default function PersonasTable<TData extends Persona, TValue>({
  columns,
  data,
  actions,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex flex-row items-center p-0.5 py-4 border-b pr-2 justify-between">
        <Input
          placeholder="Search personas..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-2xs shadow-none ml-2"
        />
        {actions}
      </div>
      {table.getFilteredRowModel().rows.length === 0 &&
        table.getCoreRowModel().rows.length > 0 &&
        table.getColumn("name")?.getFilterValue() !== "" && (
          <Empty className="w-full h-full">
            <EmptyTitle>No persona matches our search</EmptyTitle>
            <EmptyContent>
              <Button
                variant="secondary"
                onClick={() => table.getColumn("name")?.setFilterValue("")}
              >
                Reset filter
              </Button>
            </EmptyContent>
          </Empty>
        )}

      {table.getCoreRowModel().rows.length === 0 && (
        <Empty className="w-full h-full">
          <EmptyTitle>No personas created yet</EmptyTitle>
          <EmptyContent>
            <Button onClick={() => table.getColumn("name")?.setFilterValue("")}>
              <PlusIcon size="16" />
              New persona
            </Button>
          </EmptyContent>
        </Empty>
      )}
      <Table>
        <TableBody className="border-b">
          {table.getFilteredRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="p-0">
                  <Link
                    to={`/personas/${row.original.slug!}/overview`}
                    className="p-3 block"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Link>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
