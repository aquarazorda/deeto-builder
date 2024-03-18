import { useAdminState } from "@/state/admin";
import SkeletonTable from "../skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import useGetVendorDetails, {
  VendorDetailsResponse,
} from "@/queries/useGetVendorDetails";
import { CaseStudyImage } from "@/admin/types/case-study";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { capitalize } from "@/lib/utils";
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
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
      );
    },
  },
];

export default function VendorBannersTable() {
  const { vendorId } = useAdminState();
  const { data, isLoading } = useGetVendorDetails(vendorId);

  if (isLoading) {
    return <SkeletonTable cols={4} rows={6} />;
  }

  if (!data) {
    return null;
  }

  return <DataTable data={data.images} columns={columns} className="px-2" />;
}
