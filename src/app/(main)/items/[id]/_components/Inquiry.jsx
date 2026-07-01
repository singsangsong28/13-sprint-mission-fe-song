"use client";

import Button from "@/components/common/Button";
import {
  createPcomment,
  deletePcomment,
  getPcomments,
  updatePcomment,
} from "@/lib/ProductApi";
import { useEffect, useState } from "react";
import InquiryList from "./InquiryList";

export default function Inquiry({ productId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    try {
      setComments(await getPcomments(productId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPcomments(productId).then(setComments).catch(console.error);
  }, [productId]);

  const handleCreate = async () => {
    if (!content.trim()) return;
    try {
      await createPcomment(productId, content);
      setContent("");
      fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (commentId, updatedContent) => {
    try {
      await updatePcomment(commentId, updatedContent);
      fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("문의를 삭제하시겠습니까?")) return;
    try {
      await deletePcomment(commentId);
      fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <header className="mt-10">
        <h1 className="mb-[9px] text-base font-semibold">문의하기</h1>
      </header>
      <main>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
          className="rounded-xl bg-gray-100 h-[104px] resize-none w-full px-6 py-4 focus:outline-none mb-4"
        />
      </main>
      <footer className="flex justify-end">
        <Button onClick={handleCreate} disabled={!content.trim()}>
          등록
        </Button>
      </footer>
      <InquiryList
        comments={comments}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
