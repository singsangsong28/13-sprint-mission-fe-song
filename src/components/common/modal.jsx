"use client";

import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[calc(100%-32px)] max-w-130 bg-white rounded-2xl shadow-lg px-6 py-8 tablet:px-10 tablet:py-10"
        onClick={(e) => e.stopPropagation()}
      >
{title && (
          <h2 className="text-[20px] font-bold text-gray-900 mb-[16px]">
            {title}
          </h2>
        )}

        {children && (
          <div className="text-[16px] text-gray-600 mb-[32px]">{children}</div>
        )}

        <div className="flex gap-4">
          {onConfirm && onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-[16px] cursor-pointer hover:bg-gray-50"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm ?? onClose}
            className="flex-1 py-3.5 rounded-lg bg-primary-100 text-white font-semibold text-[16px] cursor-pointer hover:bg-primary-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
