import { getProductsById } from "@/lib/ProductApi";
import Inquiry from "./_components/Inquiry";
import ProductsDetail from "./_components/ProductsDetail";

export default async function ItemDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductsById(id);
  return (
    <div className="page-container">
      <ProductsDetail productId={id} initialProduct={product} />
      <Inquiry productId={id} />
    </div>
  );
}
