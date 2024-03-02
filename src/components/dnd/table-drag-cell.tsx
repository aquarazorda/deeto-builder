import { useSortable } from "@dnd-kit/sortable";
import { Button } from "../ui/button";
import { GripIcon } from "lucide-react";

export const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    <Button type="button" variant="ghost" {...attributes} {...listeners}>
      <GripIcon />
    </Button>
  );
};
