import getQueryClient from "@/lib/getQueryClient";
import { getProductsById } from "@/lib/ProductApi";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Inquiry from "./_components/Inquiry";
import ProductsDetail from "./_components/ProductsDetail";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: () => getProductsById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="page-container">
        <ProductsDetail productId={id} />
        <Inquiry productId={id} />
      </div>
    </HydrationBoundary>
  );
}
