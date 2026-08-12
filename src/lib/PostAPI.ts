import { dynamicFetch, tokenFetch } from "./fetchClient";

export type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  likeCount: number;
  createdAt: string;
  writer: { id: number; nickname: string };
};

export async function getBestPosts(): Promise<Post[]> {
  const data = await dynamicFetch("/articles?limit=3&orderBy=like");
  return data.list
    .sort((a: any, b: any) => b.likeCount - a.likeCount)
    .slice(0, 3);
}

export async function getPosts(
  orderBy = "recent",
  keyword = "",
): Promise<Post[]> {
  if (orderBy === "oldest") {
    const params = new URLSearchParams({ orderBy: "recent", pageSize: "9999" });
    if (keyword) params.set("keyword", keyword);
    const data = await dynamicFetch(`/articles?${params.toString()}`);
    return (data.list ?? []).reverse();
  }

  const params = new URLSearchParams({ orderBy, pageSize: "4" });
  if (keyword) params.set("keyword", keyword);
  const data = await dynamicFetch(`/articles?${params.toString()}`);
  return data.list ?? [];
}

export const getPostById = (id: string) => dynamicFetch(`/articles/${id}`);

export const createPost = ({
  title,
  content,
  image,
  ownerId,
}: {
  title: string;
  content: string;
  image?: string;
  ownerId: string | number;
}) =>
  tokenFetch("/articles", {
    method: "POST",
    body: JSON.stringify({ title, content, image, ownerId }),
  });

export const updatePost = (
  id: string,
  { title, content, image }: { title: string; content: string; image: string },
) =>
  tokenFetch(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title, content, image }),
  });

export const deletePost = (id: string) =>
  tokenFetch(`/articles/${id}`, { method: "DELETE" });

export async function getComments(articleId: string) {
  const data = await dynamicFetch(`/articles/${articleId}/comments?limit=10`);
  return data.list ?? [];
}

export const createComment = (
  articleId: string,
  { content }: { content: string },
) =>
  tokenFetch(`/articles/${articleId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

export const updateComment = (
  commentId: string,
  { content }: { content: string },
) =>
  tokenFetch(`/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });

export const deleteComment = (commentId: string) =>
  tokenFetch(`/comments/${commentId}`, { method: "DELETE" });
