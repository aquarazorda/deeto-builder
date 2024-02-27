import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHtml } from "@/state/html";
import { Form } from "@/state/panel";
import { Element } from "cheerio";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/dnd/sortable-item";
import { Separator } from "@/components/ui/separator";

export default function Form({ form }: { form: Form }) {
  const $ = useHtml(useShallow((state) => state.$));

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
      key: $(el).attr("name"),
      type: $(el).attr("type"),
      groupId,
      isGroupItem,
      placeholder: $(el).attr("placeholder"),
      description: isCheckbox ? $(parent).find("p").text() : undefined,
    };
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
    console.log(directInputs);
  }, [$]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter}>
      <div className="flex flex-col gap-2">
        {groupItems.length > 0 &&
          groupItems.map((group, i) => (
            <Card key={`group-${i}`}>
              <CardHeader>
                <CardTitle>Group {i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <SortableContext
                  strategy={verticalListSortingStrategy}
                  items={group.map(({ key }) => `group-${i}-${key}`)}
                >
                  {group.map(({ key }) => (
                    <SortableItem
                      key={`group-${i}-${key}`}
                      id={`group-${i}-${key}`}
                    >
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
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        <Button variant="outline">Add Group</Button>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Form elements</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={directInputs.map(({ key }) => `direct-${key}`)}
            >
              {directInputs.map(({ key }) => (
                <SortableItem key={`direct-${key}`} id={`direct-${key}`}>
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
      </div>
    </DndContext>
  );
}
