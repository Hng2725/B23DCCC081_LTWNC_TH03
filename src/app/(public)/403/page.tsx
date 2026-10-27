import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Không có quyền truy cập",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div className="error-page">
      <div className="error-code" style={{ color: "var(--warning)" }}>403</div>
      <h1 className="error-title">Truy cập bị từ chối</h1>
      <p className="error-message">
        Bạn không có quyền truy cập vào khu vực này. Trang này chỉ dành riêng cho Lớp trưởng (Admin).
      </p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Link href="/dashboard" className="btn btn-primary">
          Về Dashboard sinh viên
        </Link>
        <Link href="/" className="btn btn-outline">
          Về Trang chủ
        </Link>
      </div>
    </div>
  );
}
