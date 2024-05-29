import { Item } from "@/state/panel";
import WithAccordion from "./with-accordion";
import { useMemo } from "react";
import { useExtra } from "@/state/extra";
import { useShallow } from "zustand/react/shallow";
import UploadImageDialog from "@/components/dialogs/upload-image";

export default function GroupImage({ item }: { item: Item }) {
  const [extra, set] = useExtra(
    useShallow((state) => [state.state, state.set]),
  );

  const value = useMemo(() => {
    const val = extra.variables?.[item.variables![0]];
    if (val) {
      return val.match(/url\(['"]?(.*?)['"]?\)/)[1];
    }

    return item.defaultValue;
  }, [extra.variables, item]);

  const onChange = (url: string) => {
    const newStyles = item.variables?.reduce(
      (acc, key) => {
        acc[key] = `url('${url}')`;
        return acc;
      },
      {} as Record<string, string>,
    );

    set({
      ...extra,
      variables: {
        ...extra.variables,
        ...newStyles,
      },
    });
  };

  return (
    <WithAccordion item={item}>
      <div
        className="rounded-[100px] py-4 px-5 flex justify-center cursor-pointer"
        style={{
          backgroundColor: "#DDD7E5",
        }}
      >
        <UploadImageDialog onSave={onChange}>
          <img src={value} width={157} height={38} className="max-h-[38px]" />
        </UploadImageDialog>
      </div>
    </WithAccordion>
  );
}
