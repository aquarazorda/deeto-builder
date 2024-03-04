"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  FilterFn,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  TableState,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Input } from "./input";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { cn } from "@/lib/utils";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableRow } from "../dnd/table-draggable-row";
import { FieldValues } from "react-hook-form";

interface DataTableProps<TValue, TData = FieldValues> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  maxHeight?: number;
  renderSave?: ReactNode;
  state?: Partial<TableState>;
  sort?: {
    onSort?: (data: TData[]) => void;
    uniqueIdentifier: keyof TData;
  };
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const Div = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => <div className={className}>{children}</div>;

export function DataTable<TValue, TData = FieldValues>({
  columns,
  data: parentData,
  maxHeight,
  className,
  renderSave,
  sort,
  state,
}: DataTableProps<TValue, TData>) {
  const [data, setData] = useState(parentData);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>(state?.sorting ?? []);

  const Wrapper = maxHeight ? ScrollArea : Div;

  const dataIds = useMemo<UniqueIdentifier[]>(() => {
    return sort
      ? data?.map((d) => d[sort.uniqueIdentifier] as UniqueIdentifier)
      : [];
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) =>
      sort?.uniqueIdentifier ? row[sort.uniqueIdentifier] : row.id,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      sorting,
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        const newData = arrayMove(data, oldIndex, newIndex);

        sort?.onSort?.(newData);
        return newData;
      });
    }
  }

  useEffect(() => {
    setData(parentData);
  }, [parentData]);

  useEffect(() => {
    setSorting(state?.sorting ?? []);
  }, [state?.sorting]);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className={cn("w-full", className)}>
        <div className="flex items-center py-4 sticky top-10 z-20">
          <Input
            placeholder="Filter..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          {renderSave}
        </div>
        <div className="relative">
          <Wrapper style={{ height: maxHeight }} className="border rounded-md">
            <Table>
              <TableHeader className="bg-secondary sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            // @ts-expect-error className can be here
                            header.column.columnDef.meta?.className,
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows?.length ? (
                    table
                      .getRowModel()
                      .rows.map((row) => (
                        <DraggableRow
                          key={row.id}
                          row={row}
                          uniqueIdentifier={sort?.uniqueIdentifier as string}
                        />
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </Wrapper>
          {data?.length > 10 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount().toLocaleString()}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
