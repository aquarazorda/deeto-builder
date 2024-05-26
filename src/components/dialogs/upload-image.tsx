import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { usePanel } from "@/state/panel";
import { useShallow } from "zustand/react/shallow";
import LoadingSpinner from "../ui/loading-spinner";

type Props = {
  children: React.ReactNode;
  onSave: (url: string) => void;
};

export default function UploadImageDialog({ children, onSave }: Props) {
  const file = useRef<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const save = usePanel(useShallow((state) => state.saveImage));

  const onButtonClick = async () => {
    if (!file.current || !save) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await save(file.current.name, file.current);
      onSave(res);
    } catch {}

    setIsLoading(false);
  };

  return (
    <div onClick={() => inputRef.current?.click()} className="cursor-pointer">
      {isLoading ? <LoadingSpinner /> : children}
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
