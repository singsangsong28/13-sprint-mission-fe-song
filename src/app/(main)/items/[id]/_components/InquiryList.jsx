"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import InquiryItem from "./InquiryItem";

export default function InquiryList({ comments, onUpdate, onDelete }) {
  const [backHref, setBackHref] = useState("/items");

  useEffect(() => {
    const saved = localStorage.getItem("sortOrder");
    if (saved) setBackHref(`/items?orderBy=${saved}`);
  }, []);

  return (
    <>
      {!comments?.length ? (
        <div className="flex flex-col justify-center items-center">
          <Image
            src="/images/Img_inquiry_empty.png"
            width={196}
            height={230}
            alt="문의 없음"
          />

          <p className="text-gray-400 text-center">아직 문의가 없어요.</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {comments.map((comment) => (
            <InquiryItem
              key={comment.id}
              comment={comment}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Link
          href={backHref}
          className="rounded-[40px] bg-primary-100 px-16 py-3 font-semibold text-white mt-12 mb-14 cursor-pointer flex items-center gap-2"
        >
          목록으로 돌아가기
          <Image
            src="/images/ic_back.png"
            width={24}
            height={24}
            alt="목록으로 돌아가기"
          />
        </Link>
      </div>
    </>
  );
}
