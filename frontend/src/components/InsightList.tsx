import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "./ui/input";
import { Empty, EmptyTitle } from "./ui/empty";

interface InsightListProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function InsightList<TData, TValue>({
  columns,
  data,
}: InsightListProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
    },
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-2xs shadow-none ml-2"
        />
      </div>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableBody
          className="border-t border-b data-[empty=true]:border-b-0"
          data-empty={table.getRowModel().rows?.length === 0}
        >
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <td>
                <Empty>
                  <EmptyTitle>No insights yet</EmptyTitle>
                </Empty>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
