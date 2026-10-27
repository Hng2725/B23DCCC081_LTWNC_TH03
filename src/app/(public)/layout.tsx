import Header from "@/components/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 120px)" }}>
        {children}
      </main>
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1.5rem",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          background: "var(--surface)",
        }}
      >
        <div className="container">
          <p>Deadline Hub — Cổng thông tin deadline của lớp | Học viện Công nghệ Bưu chính Viễn thông (PTIT)</p>
          <p style={{ marginTop: "0.25rem", fontSize: "0.75rem" }}>
            Hệ thống hỗ trợ sinh viên theo dõi bài tập, đồ án và lịch kiểm tra đúng hạn.
          </p>
        </div>
      </footer>
    </>
  );
}
