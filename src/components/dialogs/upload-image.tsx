import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { usePanel } from "@/state/panel";
import { useShallow } from "zustand/react/shallow";

type Props = {
  children: React.ReactNode;
  onSave: (url: string) => void;
};

export default function UploadImageDialog({ children, onSave }: Props) {
  const file = useRef<File>();

  const [isOpen, setIsOpen] = useState(false);
  const save = usePanel(useShallow((state) => state.saveImage));

  const onButtonClick = async () => {
    if (!file.current || !save) {
      setIsOpen(false);
      return;
    }

    const res = await save(file.current.name, file.current);
    onSave(res);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent style={{ zIndex: 1000 }}>
        <DialogHeader>Upload Image</DialogHeader>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            file.current = e.target.files?.[0];
          }}
        />
        <DialogFooter>
          <Button type="button" onClick={onButtonClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
