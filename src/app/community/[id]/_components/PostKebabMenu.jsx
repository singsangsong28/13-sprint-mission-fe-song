// _components/PostKebabMenu.jsx
"use client";

import { deletePost } from "@/lib/PostAPI";
import { useRouter } from "next/navigation";
import KebabMenu from "./KebabMenu";

export default function PostKebabMenu({ postId }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/community/${postId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(postId);
      router.push("/community");
    } catch (err) {
      alert(err.message);
    }
  };

  return <KebabMenu onEdit={handleEdit} onDelete={handleDelete} />;
}
