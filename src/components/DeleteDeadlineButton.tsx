"use client";

import { useTransition } from "react";
import { deleteDeadlineAction } from "@/lib/actions";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";

interface DeleteDeadlineButtonProps {
  deadlineId: string;
  deadlineTitle: string;
}

export default function DeleteDeadlineButton({
  deadlineId,
  deadlineTitle,
}: DeleteDeadlineButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xoá deadline "${deadlineTitle}" không?`)) {
      startTransition(async () => {
        const res = await deleteDeadlineAction(deadlineId);
        if (res?.error) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-danger btn-sm"
      style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
    >
      {isPending ? (
        <>
          <LoadingOutlined />
          <span>Đang xoá...</span>
        </>
      ) : (
        <>
          <DeleteOutlined />
          <span>Xoá</span>
        </>
      )}
    </button>
  );
}
