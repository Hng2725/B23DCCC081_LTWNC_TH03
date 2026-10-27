import AntIcon from "@/components/AntIcon";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubjectBySlug, getSubjects, getDeadlinesBySubject } from "@/lib/data";
import CountdownBadge from "@/components/CountdownBadge";
import { formatDate, getTypeLabel, getPriorityLabel } from "@/lib/utils";
import type { Metadata } from "next";
import SubjectIcon from "@/components/SubjectIcon";

interface SubjectDetailProps {
  params: Promise<{ slug: string }>;
}

// SSG: Pre-render all subjects at build time
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: SubjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) return { title: "Không tìm thấy môn học" };

  return {
    title: `${subject.name} (${subject.code})`,
    description: `Danh sách deadline và bài tập môn ${subject.name} - ${subject.code}`,
  };
}

export const dynamic = "force-static";

export default async function SubjectDetailPage({ params }: SubjectDetailProps) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(subject.id);

  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <Link href="/subjects">Môn học</Link>
        <span className="sep">/</span>
        <span>{subject.name}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <SubjectIcon slug={subject.slug} id={subject.id} style={{ fontSize: "2.5rem" }} />
        <div>
          <h1 className="page-title">{subject.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Mã học phần: <strong>{subject.code}</strong> • {deadlines.length} bài tập & deadline
          </p>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Danh sách bài tập & hạn nộp</h2>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {deadlines.length} deadline
        </span>
      </div>

      {deadlines.length === 0 ? (
        <div className="card empty-state">
          <p className="empty-state-icon"><AntIcon name="trophy"  /></p>
          <p className="empty-state-text">Hiện tại môn này chưa có deadline nào!</p>
        </div>
      ) : (
        <div className="deadline-list">
          {deadlines.map((item) => (
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
      )}
    </div>
  );
}
