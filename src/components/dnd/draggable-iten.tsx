import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import { Slot } from "@radix-ui/react-slot";
import { ReactNode } from "react";

export default function DraggableItem({
  id,
  index,
  children,
}: {
  id: UniqueIdentifier;
  index: number;
  children: ReactNode;
}) {
  const { setNodeRef } = useDraggable({
    id,
    data: {
      index,
    },
  });
  return <Slot ref={setNodeRef}>{children}</Slot>;
}
