"use client";

import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/lib/PostAPI";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      setComments(await getComments(postId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCreate = async (content) => {
    try {
      await createComment(postId, { content });
      fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      await updateComment(commentId, { content });
      fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <CommentForm onSubmit={handleCreate} />
      <CommentList
        comments={comments}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
}
