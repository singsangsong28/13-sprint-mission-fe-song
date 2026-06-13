"use client";

import Button from "@/components/common/Button";
import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await onSubmit?.(content);
    setContent("");
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-[9px]">댓글달기</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력해주세요."
        className="w-full bg-gray-100 rounded-[12px] p-3 min-h-[104px] px-[24px] py-[16px] resize-none"
      />
      <div className="flex justify-end mt-2">
        <Button onClick={handleSubmit} disabled={!content.trim()}>
          등록
        </Button>
      </div>
    </div>
  );
}
