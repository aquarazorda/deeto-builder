import { Slot } from "@radix-ui/react-slot";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";
import { SortableContext, SortingStrategy } from "@dnd-kit/sortable";

export default function DroppableItem({
  id,
  children,
  items,
  strategy,
}: {
  id: string;
  children: ReactNode;
  items: (
    | UniqueIdentifier
    | {
        id: UniqueIdentifier;
      }
  )[];
  strategy?: SortingStrategy;
}) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "container",
    },
  });

  return (
    <SortableContext items={items} strategy={strategy}>
      <Slot ref={setNodeRef}>{children}</Slot>
    </SortableContext>
  );
}
