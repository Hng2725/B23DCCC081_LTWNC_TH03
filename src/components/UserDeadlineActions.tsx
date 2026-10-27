"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ToggleDoneButton from "./ToggleDoneButton";
import DeleteDeadlineButton from "./DeleteDeadlineButton";

interface UserDeadlineActionsProps {
  deadlineId: string;
  deadlineTitle: string;
}

export default function UserDeadlineActions({
  deadlineId,
  deadlineTitle,
}: UserDeadlineActionsProps) {
  const [user, setUser] = useState<{ id: string; role: string; isDone: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user-status?deadlineId=${deadlineId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [deadlineId]);

  if (loading) {
    return (
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Đang kiểm tra trạng thái...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        <Link href={`/login?callbackUrl=/deadlines/${deadlineId}`} style={{ fontWeight: 600 }}>
          Đăng nhập
        </Link>{" "}
        để đánh dấu deadline đã xong.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ToggleDoneButton deadlineId={deadlineId} isDone={user.isDone} />
        <span style={{ fontSize: "0.85rem", color: user.isDone ? "var(--success)" : "var(--text-muted)" }}>
          {user.isDone ? "Bạn đã hoàn thành deadline này" : "Chưa hoàn thành"}
        </span>
      </div>

      {user.role === "admin" && (
        <DeleteDeadlineButton
          deadlineId={deadlineId}
          deadlineTitle={deadlineTitle}
        />
      )}
    </div>
  );
}
