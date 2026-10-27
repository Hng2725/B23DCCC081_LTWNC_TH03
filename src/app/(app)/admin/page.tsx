import AntIcon from "@/components/AntIcon";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { can } from "@/lib/permissions";
import { getDeadlinesWithSubject, getSubjects } from "@/lib/data";
import { formatDate, getTypeLabel, getPriorityLabel } from "@/lib/utils";
import AddDeadlineForm from "@/components/AddDeadlineForm";
import DeleteDeadlineButton from "@/components/DeleteDeadlineButton";
import CountdownBadge from "@/components/CountdownBadge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị lớp (Admin)",
  robots: {
    index: false,
    follow: false,
  },
};

// SSR Strategy (Server-Side Rendering)
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  // Defense-in-depth: Page-level authorization check
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!can(session.user.role, "add_deadline")) {
    redirect("/403");
  }

  const [deadlines, subjects] = await Promise.all([
    getDeadlinesWithSubject(),
    getSubjects(),
  ]);

  return (
    <div className="container-wide page">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <Link href="/dashboard">Dashboard</Link>
        <span className="sep">/</span>
        <span>Quản trị Deadline</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Trang Quản Trị Của Lớp Trưởng <AntIcon name="safetyCertificate"  /></h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Quản lý thêm, sửa và xoá các deadline của lớp. Thay đổi sẽ kích hoạt ISR làm mới trang chi tiết và danh sách ngay lập tức.
          </p>
        </div>
        <span className="role-tag admin" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          Tài khoản Admin: {session.user.email}
        </span>
      </div>

      <div className="detail-body" style={{ gridTemplateColumns: "360px 1fr", gap: "2rem" }}>
        {/* Left column: Add deadline form */}
        <div>
          <div className="card">
            <h2 className="card-title"><AntIcon name="plus"  /> Thêm Deadline Mới</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Điền thông tin deadline để toàn bộ lớp cùng theo dõi.
            </p>
            <AddDeadlineForm subjects={subjects} />
          </div>
        </div>

        {/* Right column: Manage existing deadlines */}
        <div>
          <div className="card">
            <div className="section-header">
              <h2 className="card-title">
                <AntIcon name="unorderedList"  /> Quản lý danh sách deadline ({deadlines.length})
              </h2>
            </div>

            {deadlines.length === 0 ? (
              <p className="empty-state-text">Chưa có deadline nào.</p>
            ) : (
              <div className="deadline-list">
                {deadlines.map((item) => (
                  <article key={item.id} className="deadline-card" style={{ padding: "0.875rem 1rem" }}>
                    <div className="deadline-card-header">
                      <div>
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="deadline-card-title"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {item.title}
                        </Link>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                          Môn: <strong>{item.subject.name}</strong> • Hạn: <strong>{formatDate(item.dueDate)}</strong>
                        </div>
                      </div>
                      <CountdownBadge dueDate={item.dueDate} />
                    </div>

                    <div className="deadline-card-footer" style={{ marginTop: "0.5rem" }}>
                      <div className="deadline-card-meta">
                        <span className="tag tag-type">{getTypeLabel(item.type)}</span>
                        <span className={`tag tag-priority-${item.priority}`}>
                          {getPriorityLabel(item.priority)}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Xem
                        </Link>
                        <DeleteDeadlineButton
                          deadlineId={item.id}
                          deadlineTitle={item.title}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
