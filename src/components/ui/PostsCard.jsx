import Image from "next/image";
import Link from "next/link";

export default function PostsCard({ post }) {
  const { id, title, content, image, likeCount, createdAt } = post;
  const date = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <Link
      href={`/community/${id}`}
      className="block bg-gray-50 rounded-[8px] p-6 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start gap-[20px]">
        <p className="text-gray-800 text-lg font-bold leading-snug mt-[16px] mb-[26px]">
          {title}
        </p>
        <div className="relative w-[88px] h-[88px] flex-shrink-0">
          <Image
            src={image || "/placeholder-bestPost.jpg"}
            alt="자유게시판 게시글"
            fill
            sizes="88px"
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-between  gap-2 text-sm text-gray-400 mt-6">
        <div className="flex gap-2">
          <Image
            src="/images/ic_profile.png"
            width={24}
            height={24}
            alt="프로필 사진"
          />
          <span className="text-[14px]">{id}</span>
          <span className="text-[14px]">{date}</span>
        </div>
        <span className="flex items-center gap-1 text-[16px]">
          ♡ {likeCount >= 9999 ? "9999+" : likeCount}
          {/* 9999개 이상 시 9999+로 표현 */}
        </span>
      </div>
    </Link>
  );
}
