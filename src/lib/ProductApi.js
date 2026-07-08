import { dynamicFetch, tokenFetch, tokenUploadFetch } from "./fetchClient";

export async function getBestProduct() {
  const data = await dynamicFetch("/products?limit=4&orderBy=favorite");
  return data.list
    .sort((a, b) => b.favoriteCount - a.favoriteCount)
    .slice(0, 4);
}

export async function getProducts(orderBy = "recent", keyword = "", page = 1) {
  const pageSize = 10;

  if (orderBy === "oldest") {
    const params = new URLSearchParams({ orderBy: "recent", pageSize: "9999" });
    if (keyword) params.set("keyword", keyword);
    const data = await dynamicFetch(`/products?${params.toString()}`);
    const allItems = (data.list ?? []).reverse();
    const start = (page - 1) * pageSize;
    return {
      list: allItems.slice(start, start + pageSize),
      totalCount: data.totalCount ?? 0,
    };
  }

  const apiOrderBy = orderBy === "like" ? "favorite" : orderBy;
  const params = new URLSearchParams({
    orderBy: apiOrderBy,
    pageSize: String(pageSize),
    page: String(page),
  });
  if (keyword) params.set("keyword", keyword);
  const data = await dynamicFetch(`/products?${params.toString()}`);
  return { list: data.list ?? [], totalCount: data.totalCount ?? 0 };
}

export async function getProductsById(id, token) {
  return dynamicFetch(`/products/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { imageUrl } = await tokenUploadFetch("/products/upload", formData);
  return imageUrl.startsWith("http")
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_API_KEY}${imageUrl}`;
};

export const createProduct = ({ name, description, images, price, tags }) =>
  tokenFetch("/products", {
    method: "POST",
    body: JSON.stringify({ name, description, images, price, tags }),
  });

export const updateProduct = (productId, data) =>
  tokenFetch(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteProduct = (productId) =>
  tokenFetch(`/products/${productId}`, { method: "DELETE" });

export const favoriteProduct = (productId) =>
  tokenFetch(`/products/${productId}/favorite`, { method: "POST" });

export const unfavoriteProduct = (productId) =>
  tokenFetch(`/products/${productId}/favorite`, { method: "DELETE" });

export async function getPcomments(productsId) {
  const data = await dynamicFetch(`/products/${productsId}/comments?limit=10`);
  return data.list ?? [];
}

export const createPcomment = (productId, content) =>
  tokenFetch(`/products/${productId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

export const updatePcomment = (commentId, content) =>
  tokenFetch(`/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });

export const deletePcomment = (commentId) =>
  tokenFetch(`/comments/${commentId}`, { method: "DELETE" });
