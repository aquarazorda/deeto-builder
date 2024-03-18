import { useAdminState } from "@/state/admin";
import SkeletonTable from "../skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import useGetVendorDetails, {
  VendorDetailsResponse,
} from "@/queries/useGetVendorDetails";
import { CaseStudyImage } from "@/admin/types/case-study";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { capitalize, copyToClipboard } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import useRemoveImageMutation from "@/queries/useRemoveImageMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useUploadFile from "@/queries/useUploadFile";
import useAddImage from "@/queries/useAddImage";
import { useState } from "react";
import TableActionDropdown from "../utils/action-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const columns: ColumnDef<CaseStudyImage>[] = [
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <img
            src={row.original.imagePath}
            className="size-40 cursor-pointer object-cover"
          />
        </DialogTrigger>
        <DialogContent className="flex items-center justify-center py-8 px-12">
          <img src={row.original.imagePath} />
        </DialogContent>
      </Dialog>
    ),
  },
  {
    header: "Title",
    accessorFn: ({ imagePath }) => {
      const split = imagePath.split("/");
      return split[split.length - 1];
    },
    cell: ({ getValue }) => (
      <span className="truncate">{getValue() as string}</span>
    ),
  },
  {
    header: "Type",
    accessorFn: ({ imageType }) => capitalize(imageType),
  },
  {
    id: "action",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { vendorId } = useAdminState();
      const { mutateAsync, isPending } = useRemoveImageMutation();

      const onRemove = async () => {
        const res = await mutateAsync(row.original.caseStudyImageId);

        if (res) {
          queryClient.setQueryData<VendorDetailsResponse>(
            ["vendor-details", vendorId],
            (data) => {
              if (!data) {
                return data;
              }

              return {
                ...data,
                images: data.images.filter(
                  (img) =>
                    img.caseStudyImageId !== row.original.caseStudyImageId,
                ),
              };
            },
          );

          toast.success("Image removed successfully");
          return;
        }

        toast.error("Failed to remove image");
      };

      return (
        <div className="flex items-center gap-2 justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  You are about to delete an image.
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action is irreversible. Are you sure you want to delete
                  this image?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onRemove}
                  disabled={isPending}
                  className="bg-destructive hover:bg-destructive/80"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <TableActionDropdown>
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.original.imagePath)}
            >
              Copy image URL
            </DropdownMenuItem>
          </TableActionDropdown>
        </div>
      );
    },
  },
];

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const uploadNewSchema = z.object({
  imageType: z.enum(["banner", "square"]),
  image: z
    .any()
    .refine((files) => !!files, "Image is required.")
    .refine((files) => files?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    ),
});

const UploadNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { vendorId } = useAdminState();
  const queryClient = useQueryClient();

  const { mutateAsync: uploadFile, isPending: isUploadPending } =
    useUploadFile();
  const { mutateAsync: addImage, isPending: isAddImagePending } = useAddImage();

  const form = useForm<z.infer<typeof uploadNewSchema>>({
    resolver: zodResolver(uploadNewSchema),
    mode: "onChange",
    defaultValues: {
      imageType: "banner",
    },
  });

  const onSubmit = async (values: z.infer<typeof uploadNewSchema>) => {
    if (!vendorId) return;

    try {
      const imagePath = await uploadFile(values.image);
      const res = await addImage({
        imagePath,
        imageType: values.imageType,
        vendorId,
        fileName: values.image.name,
      });

      if (res) {
        queryClient.invalidateQueries({
          queryKey: ["vendor-details", vendorId],
          exact: true,
        });

        toast.success("Image uploaded successfully");
        setIsOpen(false);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (_) {
      toast.error("Failed to upload image");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>Upload new image</Button>
      </AlertDialogTrigger>
      <Form {...form}>
        <AlertDialogContent className="min-w-96">
          <AlertDialogHeader>
            <AlertDialogTitle className="mb-4">
              Upload new image
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="imageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <FormControl>
                          <SelectValue />
                        </FormControl>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Choose image</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        onChange={(event) => {
                          onChange(event.target.files?.[0]);
                        }}
                        className="cursor-pointer"
                        accept=".jpg, .jpeg, .png, .webp"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              disabled={
                !form.formState.isValid || isUploadPending || isAddImagePending
              }
              onClick={form.handleSubmit(onSubmit)}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Form>
    </AlertDialog>
  );
};

export default function VendorBannersTable() {
  const { vendorId } = useAdminState();
  const { data, isLoading } = useGetVendorDetails(vendorId);

  if (isLoading) {
    return <SkeletonTable cols={4} rows={6} />;
  }

  if (!data) {
    return null;
  }

  return (
    <DataTable
      data={data.images}
      columns={columns}
      className="px-2"
      renderSave={<UploadNew />}
    />
  );
}
