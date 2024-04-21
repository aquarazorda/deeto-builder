import { useRef } from "react";
import { Input } from "../ui/input";
import { usePanel } from "@/state/panel";
import { useShallow } from "zustand/react/shallow";

type Props = {
  children: React.ReactNode;
  onSave: (url: string) => void;
};

export default function UploadImageDialog({ children, onSave }: Props) {
  const file = useRef<File>();
  const inputRef = useRef<HTMLInputElement>(null);

  const save = usePanel(useShallow((state) => state.saveImage));

  const onButtonClick = async () => {
    if (!file.current || !save) {
      return;
    }

    const res = await save(file.current.name, file.current);
    onSave(res);
  };

  return (
    <div onClick={() => inputRef.current?.click()} className="cursor-pointer">
      {children}
      <Input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => {
          file.current = e.target.files?.[0];
          onButtonClick();
        }}
      />
    </div>
  );
}
