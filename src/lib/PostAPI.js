import { defaultFetch, dynamicFetch, tokenFetch } from './fetchClient';

export async function getBestPosts() {
  const data = await dynamicFetch('/articles?limit=3&orderBy=like');
  return data.list.sort((a, b) => b.likeCount - a.likeCount).slice(0, 3);
}

export async function getPosts(orderBy = 'recent', keyword = '') {
  const apiOrderBy = orderBy === 'oldest' ? 'recent' : orderBy;
  const params = new URLSearchParams({ orderBy: apiOrderBy, pageSize: '4' });
  if (keyword) params.set('keyword', keyword);
  const data = await dynamicFetch(`/articles?${params.toString()}`);
  const list = data.list ?? [];
  return orderBy === 'oldest' ? list.reverse() : list;
}

export const getPostById = (id) => dynamicFetch(`/articles/${id}`);

export const createPost = ({ title, content, image, ownerId }) =>
  defaultFetch('/articles', { method: 'POST', body: JSON.stringify({ title, content, image, ownerId }) });

export const updatePost = (id, { title, content, image }) =>
  defaultFetch(`/articles/${id}`, { method: 'PATCH', body: JSON.stringify({ title, content, image }) });

export const deletePost = (id) =>
  defaultFetch(`/articles/${id}`, { method: 'DELETE' });

export async function getComments(articleId) {
  const data = await dynamicFetch(`/articles/${articleId}/comments?limit=10`);
  return data.list ?? [];
}

export const createComment = (articleId, { content }) =>
  tokenFetch(`/articles/${articleId}/comments`, { method: 'POST', body: JSON.stringify({ content }) });

export const updateComment = (commentId, { content }) =>
  tokenFetch(`/comments/${commentId}`, { method: 'PATCH', body: JSON.stringify({ content }) });

export const deleteComment = (commentId) =>
  tokenFetch(`/comments/${commentId}`, { method: 'DELETE' });
