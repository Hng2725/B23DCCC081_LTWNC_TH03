import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-code">404</div>
      <h1 className="error-title">Không tìm thấy trang yêu cầu</h1>
      <p className="error-message">
        Nội dung hoặc deadline bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.
      </p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
        <Link href="/deadlines" className="btn btn-outline">
          Xem danh sách deadline
        </Link>
      </div>
    </div>
  );
}
