"use client";

import Modal from "@/components/common/modal";
import {
  deleteProduct,
  favoriteProduct,
  getProductsById,
  unfavoriteProduct,
  updateProduct,
} from "@/lib/ProductApi";
import { useAuth } from "@/providers/providers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import KebabMenu from "./KebabMenu";

export default function ProductsDetail({ productId, initialProduct }) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    initialProduct?.images?.[0] || "/images/alt_image.png",
  );

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/login");
    }
  }, [router]);

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => {
      const token = localStorage.getItem("accessToken");
      return getProductsById(productId, token);
    },
    initialData: initialProduct,
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => router.push("/items"),
    onError: (err) => alert(err.message),
  });

  const { mutate: handleUpdate } = useMutation({
    mutationFn: (data) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setIsEditing(false);
    },
    onError: (err) => alert(err.message),
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: () =>
      product.isFavorite
        ? unfavoriteProduct(productId)
        : favoriteProduct(productId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["product", productId] }),
    onError: (err) => alert(err.message),
  });

  if (!product) return <div className="mt-6 text-gray-400">불러오는 중...</div>;

  const {
    name,
    description,
    price,
    tags,
    favoriteCount,
    createdAt,
    ownerNickname,
    ownerId,
    isFavorite,
  } = product;

  const isOwner = user?.id === ownerId;

  const date = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  if (isEditing && editForm === null) {
    setEditForm({ name, description, price, tags });
  }

  return (
    <>
      <div className="flex flex-row mt-6 gap-6 pb-10 border-b border-gray-200">
        <figure className="relative w-[486px] h-[486px] shrink-0">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="rounded-2xl object-cover"
            onError={() => setImgSrc("/images/alt_image.png")}
          />
        </figure>
        <article className="flex-1">
          <div className="flex justify-between items-start">
            {isEditing ? (
              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                className="font-semibold text-2xl border-b border-gray-300 focus:outline-none w-full mr-4"
              />
            ) : (
              <h1 className="font-semibold text-2xl">{name}</h1>
            )}
            {isOwner && (
              <KebabMenu
                onEdit={() => {
                  setEditForm({ name, description, price, tags });
                  setIsEditing(true);
                }}
                onDelete={() => setShowDeleteModal(true)}
              />
            )}
          </div>

          {isEditing ? (
            <div className="flex items-baseline pb-4 border-b border-gray-300">
              <input
                type="text"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                size={String(editForm.price).length || 1}
                className="font-semibold text-[50px] focus:outline-none"
              />
              <span className="font-semibold text-[50px]">원</span>
            </div>
          ) : (
            <p className="font-semibold text-[50px] pb-4 mb-10">
              {price.toLocaleString()}원
            </p>
          )}

          <h2 className="font-semibold text-[16px]">상품 소개</h2>
          {isEditing ? (
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full mt-4 mb-6 bg-gray-100 rounded-xl px-4 py-3 resize-none focus:outline-none"
              rows={4}
            />
          ) : (
            <p className="font-normal text-[16px] mt-4 mb-6 text-gray-600">
              {description}
            </p>
          )}

          <h3 className="mb-4">상품 태그</h3>
          <div>
            {(isEditing ? editForm.tags : tags).map((t) => (
              <span
                key={t}
                className="mr-2 px-4 py-[6px] bg-gray-100 rounded-3xl"
              >
                #{t}
              </span>
            ))}
          </div>

          <div className="flex justify-between mt-[62px]">
            <article className="flex gap-4 items-center">
              <Image
                src="/images/ic_profile.png"
                alt="프로필 사진"
                width={40}
                height={40}
              />
              <div>
                <p>{ownerNickname}</p>
                <p>{date}</p>
              </div>
            </article>
            <button
              onClick={() => toggleFavorite()}
              className={`flex items-center gap-1 px-4 py-2 rounded-full border cursor-pointer ${
                isFavorite
                  ? "border-primary-100 text-primary-100"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {isFavorite ? "♥" : "♡"} {favoriteCount}
            </button>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => handleUpdate(editForm)}
                className="px-6 py-2 bg-primary-100 text-white rounded-lg cursor-pointer"
              >
                수정 완료
              </button>
            </div>
          )}
        </article>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete()}
        title="정말로 상품을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      ></Modal>
    </>
  );
}
