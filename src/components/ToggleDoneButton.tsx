"use client";

import { useTransition } from "react";
import { toggleDoneAction } from "@/lib/actions";
import { CheckOutlined, CheckSquareOutlined, LoadingOutlined } from "@ant-design/icons";

interface ToggleDoneButtonProps {
  deadlineId: string;
  isDone: boolean;
}

export default function ToggleDoneButton({
  deadlineId,
  isDone,
}: ToggleDoneButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleDoneAction(deadlineId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`btn btn-sm ${isDone ? "btn-outline" : "btn-primary"}`}
      style={{ minWidth: "135px", display: "inline-flex", alignItems: "center", gap: "6px" }}
    >
      {isPending ? (
        <>
          <LoadingOutlined />
          <span>Đang lưu...</span>
        </>
      ) : isDone ? (
        <>
          <CheckOutlined style={{ color: "var(--success)" }} />
          <span>Đã xong (Hủy)</span>
        </>
      ) : (
        <>
          <CheckSquareOutlined />
          <span>Đánh dấu đã xong</span>
        </>
      )}
    </button>
  );
}
