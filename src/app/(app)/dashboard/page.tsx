import AntIcon from "@/components/AntIcon";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDeadlinesWithSubject, getUserById } from "@/lib/data";
import { formatDate, getTypeLabel, getPriorityLabel } from "@/lib/utils";
import CountdownBadge from "@/components/CountdownBadge";
import ToggleDoneButton from "@/components/ToggleDoneButton";
import Link from "next/link";

// SSR Strategy (Server-Side Rendering)
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  // Defense-in-depth: Check auth on page level
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [deadlines, user] = await Promise.all([
    getDeadlinesWithSubject(),
    getUserById(session.user.id),
  ]);

  const completedIds = user?.completedDeadlines || [];
  const completedCount = completedIds.length;
  const totalCount = deadlines.length;
  const pendingCount = totalCount - completedCount;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Split deadlines into pending and completed
  const pendingDeadlines = deadlines.filter((d) => !completedIds.includes(d.id));
  const completedDeadlines = deadlines.filter((d) => completedIds.includes(d.id));

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 700 }}>
          Xin chào, {session.user.name}! <AntIcon name="smile"  />
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Vai trò: <strong>{session.user.role === "admin" ? "Lớp trưởng (Admin)" : "Sinh viên"}</strong> • Quản lý tiến độ làm bài tập và deadline của bạn.
        </p>
      </div>

      {/* Progress card */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Tiến độ hoàn thành deadline</span>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)" }}>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <span><AntIcon name="checkCircle"  /> Đã xong: <strong>{completedCount}</strong></span>
          <span><AntIcon name="clockCircle"  /> Cần làm: <strong>{pendingCount}</strong></span>
          <span><AntIcon name="unorderedList"  /> Tổng số: <strong>{totalCount}</strong></span>
        </div>
      </div>

      {/* Pending Deadlines */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-header">
          <h2 className="section-title"><AntIcon name="clockCircle"  /> Deadlines cần hoàn thành ({pendingDeadlines.length})</h2>
        </div>

        {pendingDeadlines.length === 0 ? (
          <div className="card empty-state">
            <p className="empty-state-icon"><AntIcon name="trophy"  /></p>
            <p className="empty-state-text">Tuyệt vời! Bạn đã hoàn thành tất cả deadlines hiện có.</p>
          </div>
        ) : (
          <div className="deadline-list">
            {pendingDeadlines.map((item) => (
              <article key={item.id} className="deadline-card">
                <div className="deadline-card-header">
                  <div>
                    <Link
                      href={`/deadlines/${item.id}`}
                      className="deadline-card-title"
                      style={{ fontSize: "0.95rem", fontWeight: 600 }}
                    >
                      {item.title}
                    </Link>
                    <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      {item.description}
                    </p>
                  </div>
                  <CountdownBadge dueDate={item.dueDate} />
                </div>

                <div className="deadline-card-footer" style={{ marginTop: "0.5rem" }}>
                  <div className="deadline-card-meta">
                    <span className="tag tag-subject">{item.subject.name}</span>
                    <span className="tag tag-type">{getTypeLabel(item.type)}</span>
                    <span className={`tag tag-priority-${item.priority}`}>
                      {getPriorityLabel(item.priority)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Hạn: {formatDate(item.dueDate)}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href={`/deadlines/${item.id}`} className="btn btn-outline btn-sm">
                      Chi tiết
                    </Link>
                    <ToggleDoneButton deadlineId={item.id} isDone={false} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Completed Deadlines */}
      {completedDeadlines.length > 0 && (
        <section>
          <div className="section-header">
            <h2 className="section-title"><AntIcon name="checkCircle"  /> Đã hoàn thành ({completedDeadlines.length})</h2>
          </div>

          <div className="deadline-list">
            {completedDeadlines.map((item) => (
              <article key={item.id} className="deadline-card done">
                <div className="deadline-card-header">
                  <div>
                    <Link
                      href={`/deadlines/${item.id}`}
                      className="deadline-card-title"
                      style={{ textDecoration: "line-through", color: "var(--text-muted)" }}
                    >
                      {item.title}
                    </Link>
                    <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      {item.subject.name} • Hạn nộp: {formatDate(item.dueDate)}
                    </p>
                  </div>
                  <span className="tag" style={{ background: "var(--success-light)", color: "var(--success)" }}>
                    <AntIcon name="check"  /> Đã xong
                  </span>
                </div>

                <div className="deadline-card-footer" style={{ marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {item.subject.name}
                  </span>
                  <ToggleDoneButton deadlineId={item.id} isDone={true} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
