"use client";

import { getProducts } from "@/lib/ProductApi";
import { useQuery } from "@tanstack/react-query";
import Pagination from "./Pagination";
import Products from "./Products";

export default function ProductsSection({ orderBy, keyword, page, pageSize }) {
  const { data } = useQuery({
    queryKey: ["products", orderBy, keyword, page],
    queryFn: () => getProducts(orderBy, keyword, page),
  });

  const products = data?.list ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <>
      <section className="grid grid-cols-5 gap-6 mt-6 mb-10.5">
        {products.map((p) => (
          <Products key={p.id} post={p} />
        ))}
      </section>
      <Pagination
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </>
  );
}
