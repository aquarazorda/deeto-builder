import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHtml } from "@/state/html";
import { Form } from "@/state/panel";
import { Cheerio, Element } from "cheerio";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/dnd/sortable-item";
import { Separator } from "@/components/ui/separator";
import DroppableItem from "@/components/dnd/droppable-item";

export default function Form({ form }: { form: Form }) {
  const [$, html, setHtml] = useHtml(
    useShallow((state) => [state.$, state.html, state.setHtml]),
  );

  const [groupItems, setGroupItems] = useState<ReturnType<typeof getItem>[][]>(
    [],
  );

  const [directInputs, setDirectInputs] = useState<
    ReturnType<typeof getItem>[]
  >([]);

  const availableItems = useMemo(
    () =>
      form.elements.filter((item) => {
        return (
          groupItems.every((group) => !group.some((i) => i.key === item.key)) &&
          !directInputs.some((i) => i.key === item.key)
        );
      }),
    [groupItems, directInputs],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getItem = (el: Element, groupId?: number) => {
    const parent = $(el).parent();
    const isCheckbox = parent.hasClass("checkbox-wrapper");
    const isGroupItem = parent.hasClass("form-group");

    return {
      key: $(el).attr("name") ?? "",
      type: $(el).attr("type"),
      groupId,
      isGroupItem,
      placeholder: $(el).attr("placeholder"),
      description: isCheckbox ? $(parent).find("p").text() : undefined,
    };
  };

  const getElement = (el: Cheerio<Element>) => {
    const parent = el.parent();
    return parent.hasClass("checkbox-wrapper") ? parent : el;
  };

  useEffect(() => {
    const formGroups = $(".form-inputs")
      .find(".form-group")
      .map((i, el) =>
        $(el)
          .find("input")
          .map((_, e) => getItem(e, i))
          .toArray(),
      )
      .toArray();

    const groupedInputs = [] as (typeof formGroups)[];
    formGroups.forEach((item) => {
      if (item.groupId === undefined) return;

      if (!groupedInputs[item.groupId]) {
        groupedInputs[item.groupId] = [];
      }

      groupedInputs[item.groupId].push(item);
    });

    setGroupItems(groupedInputs);

    const directInputs = $(".form-inputs")
      .find("input")
      .map((_, el) => getItem(el))
      .toArray()
      .filter(({ isGroupItem }) => !isGroupItem);

    setDirectInputs(directInputs);
  }, [html]);

  // const findContainer = (id: UniqueIdentifier) => {
  //   if (directInputs.some((item) => item.key === id)) {
  //     return {
  //       isGroup: false,
  //       index: 0,
  //     } as const;
  //   }
  //
  //   const groupIdx = groupItems.reduce(
  //     (acc, group, i) => {
  //       const index = group.findIndex((item) => item.key === id);
  //       if (index !== -1) {
  //         return {
  //           container: i,
  //           item: index,
  //         };
  //       }
  //       return acc;
  //     },
  //     {
  //       container: -1,
  //       item: -1,
  //     },
  //   );
  //
  //   return {
  //     isGroup: groupIdx.container !== -1,
  //     container: groupIdx.container,
  //     index: groupIdx.item,
  //   } as const;
  // };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!active || !over) return;
        if (active.id === over.id) return;

        const activeElement = getElement($(`[name="${active.id}"]`));
        const overElement = getElement($(`[name="${over.id}"]`));

        // @ts-expect-error over id is alwas string
        if (over.id.includes("group")) {
          activeElement.appendTo($(`#form-${over.id}`));
          setHtml($);
          return;
        }

        if (activeElement.next().attr("name") === overElement.attr("name")) {
          activeElement.insertAfter(overElement);
          setHtml($);
          return;
        }

        activeElement.insertBefore(overElement);

        setHtml($);
      }}
    >
      <div className="flex flex-col gap-2">
        {groupItems.length > 0 &&
          groupItems.map((group, i) => (
            <DroppableItem
              key={`group-${i + 1}`}
              id={`group-${i + 1}`}
              items={group.map(({ key }) => key)}
              strategy={verticalListSortingStrategy}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Row {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {group.map(({ key }) => (
                    <SortableItem key={key} id={key}>
                      <Card>
                        <CardContent className="px-4 py-2">
                          {
                            form.elements.find((item) => item.key === key)
                              ?.title
                          }
                        </CardContent>
                      </Card>
                    </SortableItem>
                  ))}{" "}
                </CardContent>
              </Card>
            </DroppableItem>
          ))}
        <Button variant="outline">Add Row</Button>
        <DroppableItem
          key={"direct"}
          id={"direct"}
          items={directInputs.map(({ key }) => key)}
          strategy={verticalListSortingStrategy}
        >
          <Card>
            <CardHeader>
              <CardTitle>Form elements</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <SortableContext
                strategy={verticalListSortingStrategy}
                items={directInputs.map(({ key }) => key)}
              >
                {directInputs.map(({ key }) => (
                  <SortableItem key={key} id={key}>
                    <Card>
                      <CardContent className="px-4 py-2">
                        {form.elements.find((item) => item.key === key)?.title}
                      </CardContent>
                    </Card>
                  </SortableItem>
                ))}{" "}
              </SortableContext>
            </CardContent>
          </Card>
        </DroppableItem>
        <Separator />
        <DroppableItem
          key={"available"}
          id={"available"}
          items={availableItems.map(({ key }) => key)}
          strategy={verticalListSortingStrategy}
        >
          <Card>
            <CardHeader>
              <CardTitle>Available form elements</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <SortableContext
                items={availableItems.map(({ key }) => key)}
                strategy={verticalListSortingStrategy}
              >
                {availableItems.map(({ title, key }) => (
                  <SortableItem key={key} id={key}>
                    <Card>
                      <CardContent className="px-4 py-2">{title}</CardContent>
                    </Card>
                  </SortableItem>
                ))}
              </SortableContext>
            </CardContent>
          </Card>
        </DroppableItem>
      </div>
    </DndContext>
  );
}
