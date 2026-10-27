"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ReloadOutlined, WarningOutlined } from "@ant-design/icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-code" style={{ color: "var(--danger)" }}><WarningOutlined /></div>
      <h1 className="error-title">Đã xảy ra sự cố</h1>
      <p className="error-message">
        Hệ thống gặp lỗi trong quá trình xử lý yêu cầu. Vui lòng thử lại.
      </p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-primary"
        >
          <ReloadOutlined />
          <span>Thử lại</span>
        </button>
        <Link href="/" className="btn btn-outline">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
