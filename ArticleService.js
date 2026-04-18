const BASE_URL = "https://panda-market-api-crud.vercel.app"; 

// 모든 게시글 조회
export async function getArticleslist(page, pageSize, keyword) {
  try {
    const response = await fetch(
      `${BASE_URL}/articles?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("내용을 찾을 수 없습니다.", error);
  }
}

//특정 게시글 조회

export async function getArticleById(id) {
  try {
    const response = await fetch(`${BASE_URL}/articles/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("게시글을 찾을 수 없습니다.", error);
  }
}

// 게시글 생성

export async function createArticle(articleData) {
  try {
    const response = await fetch(`${BASE_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(articleData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("게시글을 생성할 수 없습니다.", error);
  }
}

// /게시글 수정

export async function updateArticle(id, articleData) {
    try {
        const response = await fetch(`${BASE_URL}/articles/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(articleData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("게시글을 수정할 수 없습니다.", error);
    }
}

// 게시글 삭제

export async function deleteArticle(id) {
    try {
        const response = await fetch(`${BASE_URL}/articles/${id}`, {
            method: "DELETE"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("게시글을 삭제할 수 없습니다.", error);
    }}