import Button from "@/components/common/Button";
import BestProducts from "@/components/ui/BestProducts";
import Pagination from "@/components/ui/Pagination";
import Products from "@/components/ui/Products";
import SearchInput from "@/components/ui/SeartchInput";
import SortDropDown from "@/components/ui/SortDropDown";
import { getBestProduct, getProducts } from "@/lib/ProductApi";

const PAGE_SIZE = 10;

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const orderBy = params?.orderBy ?? "recent";
  const keyword = params?.keyword ?? "";
  const page = Number(params?.page ?? 1);

  const bestProducts = await getBestProduct();
  const { list: products, totalCount } = await getProducts(
    orderBy,
    keyword,
    page,
  );

  return (
    <div className="page-container mt-6.5">
      <h1 className="text-xl font-bold mb-4">베스트 상품</h1>
      <section className="flex gap-4">
        {bestProducts.map((product) => (
          <BestProducts key={product.id} post={product} />
        ))}
      </section>
      <section className="flex justify-between items-center mt-10">
        <h2 className="text-xl font-bold">판매 중인 상품</h2>
        <nav className="flex gap-3 items-center">
          <SearchInput defaultValue={keyword} />
          <Button>상품 등록하기</Button>
          <SortDropDown current={orderBy} />
        </nav>
      </section>
      <section className="grid grid-cols-5 gap-6 mt-6 mb-10.5">
        {products.map((p) => (
          <Products key={p.id} post={p} />
        ))}
      </section>
      <Pagination
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        currentPage={page}
      />
    </div>
  );
}
