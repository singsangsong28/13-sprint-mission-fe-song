const BASE_URL = process.env.NEXT_PUBLIC_POST_API_KEY;

/**
 * GET Articles
 * @param {string} orderBy - 정렬 기준 (recent | oldest | favorite)
 * @returns {Promise<Array>} 게시글 데이터 배열
 */
/**
 * 베스트 게시글(좋아요 상위 3개)
 * @returns {Promise<Array>} 게시글 데이터 배열
 */
export async function getBestPosts() {
  const res = await fetch(`${BASE_URL}/articles?orderBy=favorite&limit=3`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("베스트 게시글 데이터를 가져오는데 실패했습니다");
  }

  const data = await res.json();
  return data.list.sort((a, b) => b.likeCount - a.likeCount).slice(0, 3);
}

// 게시글 조회 (기본값 : 최신순)
export async function getPosts(orderBy = "recent", keyword = "") {
  const params = new URLSearchParams({ orderBy, limit: "4" });
  if (keyword) {
    params.set("keyword", keyword);
  }
  const res = await fetch(`${BASE_URL}/articles?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("게시글 데이터를 가져오는데 실패했습니다");
  }
  const data = await res.json();
  return data.list ?? [];
}

/**
 * GET article [id] (게시글 아이디로)
 * @param {string} id - 게시글 id
 * @returns {Promise<Object>} 게시글 상세 데이터
 */
export async function getPostById(id) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("게시글 상세 데이터를 가져오는데 실패했습니다");
  }

  return res.json();
}
///////////////////////////////////////////////////////////////////////////
/**
 * POST article (게시글 등록)
 * @param {{ title: string, content: string, image?: string, ownerId: number }} data
 * @returns {Promise<Object>} 생성된 게시글 데이터
 */
export async function createPost({ title, content, image, ownerId }) {
  const res = await fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, image, ownerId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "게시글 등록에 실패했습니다");
  }

  return res.json();
}

// PATCH article (게시글 수정)
export async function updatePost(id, { title, content, image }) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, image }),
  });
  if (!res.ok) {
    throw new Error("게시글 수정에 실패했습니다");
  }
  return res.json();
}

// DELETE article (게시글 삭제)
export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("게시글 삭제에 실패했습니다");
  }
  return res.json();
}

// GET comments (댓글 조회)
export async function getComments(articleId) {
  const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("댓글 목록을 가져오는데 실패했습니다");
  }
  const data = await res.json();
  return data.list ?? [];
}

// POST comment (댓글 등록)
export async function createComment(articleId, { content }) {
  const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error("댓글 등록에 실패했습니다");
  }
  return res.json();
}

// PATCH comment (댓글 수정)
export async function updateComment(commentId, { content }) {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error("댓글 수정에 실패했습니다");
  }
  return res.json();
}

// DELETE comment (댓글 삭제)
export async function deleteComment(commentId) {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("댓글 삭제에 실패했습니다");
  }
  return res.json();
}
