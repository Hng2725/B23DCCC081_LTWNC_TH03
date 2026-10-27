import AntIcon from "@/components/AntIcon";
import Link from "next/link";
import { getDeadlinesWithSubject, getSubjects } from "@/lib/data";
import CountdownBadge from "@/components/CountdownBadge";
import { formatDate, getTypeLabel, getPriorityLabel } from "@/lib/utils";
import SubjectIcon from "@/components/SubjectIcon";

// SSG strategy (Static Site Generation)
export const dynamic = "force-static";

export default async function HomePage() {
  const [deadlines, subjects] = await Promise.all([
    getDeadlinesWithSubject(),
    getSubjects(),
  ]);

  // Sort by nearest dueDate
  const sorted = [...deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const upcoming = sorted.slice(0, 5);

  return (
    <div className="container page">
      {/* Intro hero banner */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >
        <span className="tag tag-subject" style={{ marginBottom: "0.75rem" }}>
          Lớp INT3306 - Học kỳ I 2026-2027
        </span>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.5rem 0" }}>
          Class Deadline Hub — Cổng Deadline Của Lớp
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px" }}>
          Xem lịch nộp bài tập, lab, đồ án môn học và lịch thi. Sinh viên đăng nhập để đánh dấu các deadline đã hoàn thành.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          <Link href="/deadlines" className="btn btn-primary">
            Xem toàn bộ {deadlines.length} deadline <AntIcon name="right"  />
          </Link>
          <Link href="/login" className="btn btn-outline">
            Đăng nhập sinh viên
          </Link>
        </div>
      </section>

      {/* Stats summary */}
      <section style={{ marginBottom: "2rem" }}>
        <div className="grid-3">
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--primary)" }}>{subjects.length}</div>
            <div className="stat-label">Môn học đang học</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--warning)" }}>{deadlines.length}</div>
            <div className="stat-label">Tổng số deadline</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--danger)" }}>
              {deadlines.filter((d) => d.priority === "urgent" || d.priority === "high").length}
            </div>
            <div className="stat-label">Deadline quan trọng</div>
          </div>
        </div>
      </section>

      {/* Subjects section */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div className="section-header">
          <h2 className="section-title"><AntIcon name="book"  /> Các môn học trong kỳ</h2>
          <Link href="/subjects" style={{ fontSize: "0.85rem" }}>Xem tất cả môn <AntIcon name="right"  /></Link>
        </div>

        <div className="grid-2">
          {subjects.map((sub) => {
            const count = deadlines.filter((d) => d.subjectId === sub.id).length;
            return (
              <Link
                key={sub.id}
                href={`/subjects/${sub.slug}`}
                className="subject-card"
              >
                <div className="subject-card-icon"><SubjectIcon slug={sub.slug} id={sub.id} /></div>
                <div className="subject-card-name">{sub.name}</div>
                <div className="subject-card-code">Mã môn: {sub.code}</div>
                <div className="subject-card-count">
                  {count} deadline cần nộp
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Upcoming deadlines */}
      <section>
        <div className="section-header">
          <h2 className="section-title"><AntIcon name="clockCircle"  /> Deadline sắp tới hạn nhất</h2>
          <Link href="/deadlines" style={{ fontSize: "0.85rem" }}>
            Xem toàn bộ <AntIcon name="right"  />
          </Link>
        </div>

        <div className="deadline-list">
          {upcoming.map((item) => (
            <article
              key={item.id}
              className={`deadline-card ${item.priority === "urgent" ? "urgent-priority" : ""}`}
            >
              <div className="deadline-card-header">
                <div>
                  <Link
                    href={`/deadlines/${item.id}`}
                    className="deadline-card-title"
                    style={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    {item.title}
                  </Link>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {item.description}
                  </p>
                </div>
                <CountdownBadge dueDate={item.dueDate} />
              </div>

              <div className="deadline-card-footer" style={{ marginTop: "0.5rem" }}>
                <div className="deadline-card-meta">
                  <span className="tag tag-subject">
                    <SubjectIcon slug={item.subject.slug} id={item.subject.id} /> {item.subject.name}
                  </span>
                  <span className="tag tag-type">{getTypeLabel(item.type)}</span>
                  <span className={`tag tag-priority-${item.priority}`}>
                    {getPriorityLabel(item.priority)}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Hạn: {formatDate(item.dueDate)}
                  </span>
                </div>

                <Link
                  href={`/deadlines/${item.id}`}
                  className="btn btn-outline btn-sm"
                >
                  Xem chi tiết <AntIcon name="right"  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
