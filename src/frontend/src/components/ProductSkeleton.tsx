import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-card"
      data-ocid="product.loading_state"
    >
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}
