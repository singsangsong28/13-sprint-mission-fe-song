"use client";

import { getMe } from "@/lib/UserAPI";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, []);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(token),
    enabled: !!token,
  });

  const getLinkClass = (href) =>
    `whitespace-nowrap font-bold text-[16px] tablet:text-[18px] px-[6px] tablet:px-[15px] py-[21px] ${
      pathname === href ? "text-primary-100" : "text-gray-600"
    }`;

  return (
    <>
      <div className="fixed top-0 left-0 z-100 h-[68px] w-full bg-white border-b border-solid border-gray-200">
        <div className="page-container h-full flex justify-between items-center gap-[8px]">
          <div className="flex items-center gap-[4px] tablet:gap-[8px] min-w-0">
            <Link href="/">
              <div className="flex items-center gap-[4px] tablet:gap-[8px] mr-[8px] tablet:mr-[24px] my-[15px] h-[40px]">
                <Image
                  src="/images/header-img.png"
                  width={40}
                  height={40}
                  alt="판다마켓 로고"
                  className="hidden tablet:block"
                />
                <p className="font-rokaf whitespace-nowrap text-primary-100 font-bold  text-[24px] tablet:text-[1.6rem]">
                  판다마켓
                </p>
              </div>
            </Link>
            <Link href="/community">
              <div className={getLinkClass("/community")}>자유게시판</div>
            </Link>
            <Link href="/items">
              <div className={getLinkClass("/items")}>중고마켓</div>
            </Link>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Image
                src={user.image ?? "/images/ic_profile.png"}
                width={40}
                height={40}
                alt="프로필"
                className="rounded-full"
              />
              <span className="font-normal text-[18px] text-gray-600 hidden tablet:block">
                {user.nickname}
              </span>
            </div>
          ) : (
            <Link href="/login">
              <div className="whitespace-nowrap px-[14px] tablet:px-[24px] py-[23px] bg-primary-100 rounded-[8px] h-[42px] text-white font-bold text-[16px] tablet:text-[18px] my-[14px] flex items-center">
                로그인
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
