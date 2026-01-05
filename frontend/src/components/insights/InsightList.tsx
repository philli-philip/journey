import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "../ui/input";
import { Empty, EmptyTitle } from "../ui/empty";
import { Link } from "react-router-dom";
import UpdateInsightDrawer from "./updateInsightDrawer";

interface InsightListProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function InsightList<TData, TValue>({
  columns,
  data,
}: InsightListProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex items-center py-4 border-b">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-2xs shadow-none ml-2"
        />
      </div>
      <div className="flex-auto overflow-scroll h-20 flex flex-col">
        <Table className="min-w-full divide-y divide-gray-200 ">
          <TableBody
            className="border-b data-[empty=true]:border-b-0"
            data-empty={table.getRowModel().rows?.length === 0}
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="relative p-0">
                      <>
                        <Link
                          to={`?panel=insight&id=${row.getValue("id")}`}
                          className="p-3 block cursor-pointer"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Link>
                      </>
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
      <UpdateInsightDrawer />
    </>
  );
}
