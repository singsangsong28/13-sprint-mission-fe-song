const baseUrl = "https://panda-market-api-crud.vercel.app/products";

// 모든 상품 조회
export async function getProductList() {
  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("상품을 불러올 수 없습니다.", error);
  }
}

// 특정 상품 조회
export async function getProduct(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("상품을 찾을 수 없습니다.", error);
  }
}

// 상품 생성
export async function createProduct(productData) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        tags: productData.tags,
        images: productData.images
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("상품을 생성할 수 없습니다.", error);
  }
}

// 상품 수정
export async function patchProduct(id, productData) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("상품을 수정할 수 없습니다.", error);
  }
}

// 상품 삭제
export async function deleteProduct(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE"
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("상품을 삭제할 수 없습니다.", error);
  }
}
