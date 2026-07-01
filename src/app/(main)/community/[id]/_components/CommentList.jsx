import Image from "next/image";
import Link from "next/link";
import CommentItem from "./CommentItem";

export default function CommentList({ comments, onUpdate, onDelete }) {
  return (
    <div>
      {!comments?.length ? (
        <div className="mt-[40px] flex flex-col items-center">
          <Image
            src="/images/Img_reply_empty.png"
            width={100}
            height={100}
            alt="빈 댓글"
          />
          <p className="text-gray-400 mt-4">
            아직 댓글이 없어요. <br /> 지금 댓글을 달아보세요!
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem
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
          href="/community"
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
    </div>
  );
}
