import { useSortable } from "@dnd-kit/sortable";
import { Row, flexRender } from "@tanstack/react-table";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";
import { TableCell, TableRow } from "../ui/table";
import { cn } from "@/lib/utils";
import { UniqueIdentifier } from "@dnd-kit/core";

export const DraggableRow = <TRow,>({
  row,
  uniqueIdentifier,
}: {
  row: Row<TRow>;
  uniqueIdentifier?: UniqueIdentifier;
}) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    // @ts-expect-error uniqueIdentifier can be here
    id: uniqueIdentifier ? row.original[uniqueIdentifier] : undefined,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          // @ts-expect-error className can be here
          className={cn(cell.column.columnDef.meta?.className)}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
