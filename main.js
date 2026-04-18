import { 
  getArticleslist, getArticleById, createArticle, updateArticle, deleteArticle 
} from "./ArticleService.js";
import { 
  getProductList, getProduct, patchProduct, createProduct, deleteProduct  
} from "./ProductService.js";

async function run() {
  // 게시글 테스트
  const articles = await getArticleslist(1, 2, "내용");
  console.log("게시글 목록:", articles);

  const newArticle = await createArticle({
    title: "새로운 게시글",
    content: "이것은 새로운 게시글입니다."
  });
  console.log("생성된 게시글:", newArticle);

  await updateArticle(newArticle.id, {
    title: "수정된 게시글",
    content: "이것은 수정된 게시글입니다."
  });

  await deleteArticle(newArticle.id);

  // 상품 테스트
  const products = await getProductList();
  console.log("상품 목록:", products);

  const newProduct = await createProduct({
    name: "새로운 상품",
    description: "이것은 새로운 상품입니다.",
    price: 10000,
    tags: ["신상품", "인기"],
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
  });
  console.log("생성된 상품:", newProduct);

  const updatedProduct = await patchProduct(newProduct.id, {
    name: "수정된 상품",
    description: "이것은 수정된 상품입니다.",
    price: 15000,
    tags: ["인기"],
    images: ["https://example.com/image3.jpg"]
  });
  console.log("수정된 상품:", updatedProduct);

  await deleteProduct(newProduct.id);
  console.log("상품 삭제 완료");
}

run();
