import AntIcon from "@/components/AntIcon";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDeadlinesWithSubject, getUserById } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import ToggleDoneButton from "@/components/ToggleDoneButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardCompletedPage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/completed");
  }

  const [deadlines, user] = await Promise.all([
    getDeadlinesWithSubject(),
    getUserById(session.user.id),
  ]);

  const completedIds = user?.completedDeadlines || [];
  const completedDeadlines = deadlines.filter((d) => completedIds.includes(d.id));

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 700 }}>
          Các Deadline đã hoàn thành <AntIcon name="checkCircle"  />
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Tổng cộng {completedDeadlines.length} deadline bạn đã đánh dấu hoàn thành.
        </p>
      </div>

      {completedDeadlines.length === 0 ? (
        <div className="card empty-state">
          <p className="empty-state-icon"><AntIcon name="unorderedList"  /></p>
          <p className="empty-state-text">Bạn chưa đánh dấu hoàn thành deadline nào.</p>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Xem danh sách cần làm
            </Link>
          </div>
        </div>
      ) : (
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
                    {item.subject.name} • Hạn: {formatDate(item.dueDate)}
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
      )}
    </div>
  );
}
