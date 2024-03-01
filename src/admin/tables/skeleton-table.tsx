import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";

const columns = (data: { id: number }[]): ColumnDef<Record<string, number>>[] =>
  data.map(({ id }) => ({
    id: String(id),
    accessorFn: () => id,
    header: (<Skeleton className="w-32 h-7" />) as unknown as string,
    cell: () => <Skeleton className="w-full h-9" />,
  }));

export default function SkeletonTable({ cols }: { cols: number }) {
  const data = Array.from(Array(cols).keys()).map((i) => ({
    id: i + 1,
  }));

  return (
    <DataTable
      columns={columns(data)}
      data={data.slice(0, cols - 2)}
      className="w-full"
    />
  );
}
