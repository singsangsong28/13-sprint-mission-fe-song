"use client";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import { createPost } from "@/lib/PostAPI";
import { useAuth } from "@/providers/providers";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = !title.trim() || !content.trim() || isLoading;
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newPost = await createPost({
        title,
        content,
        ownerId: user?.id,
      });
      router.push("/community");
    } catch (error) {
      console.error(error);
      alert(error.message);
      setIsLoading(false); // 실패 시에만 풀어줌 (성공 시엔 페이지 이동되므로 불필요)
    }
  };

  if (isLoading) {
    return <Loading message="게시글 등록 중..." />;
  }

  return (
    <div className="page-container mt-[24px]">
      <div className="flex flex-col">
        <div className=" mb-[32px] flex justify-between">
          <h1 className="font-bold text-[20px] py-[5px]">게시글 쓰기</h1>
          <Button onClick={handleSubmit} disabled={isDisabled}>
            등록
          </Button>
        </div>
        <div className="mb-[24px] flex flex-col gap-[12px]">
          <h2 className="font-bold text-[18px]">*제목</h2>
          <input
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-[8px] px-[24px] py-[16px] bg-gray-100"
          />
        </div>
        <div className="flex flex-col gap-[12px]">
          <h3 className="font-bold text-[18px]">*내용</h3>
          <textarea
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className=" w-full h-[282px] rounded-[8px] bg-gray-100
            px-[24px] py-[16px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
