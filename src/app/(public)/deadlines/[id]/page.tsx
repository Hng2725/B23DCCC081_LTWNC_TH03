import AntIcon from "@/components/AntIcon";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeadlineWithSubject, getDeadlines } from "@/lib/data";
import { formatDate, getTypeLabel, getPriorityLabel } from "@/lib/utils";
import CountdownBadge from "@/components/CountdownBadge";
import UserDeadlineActions from "@/components/UserDeadlineActions";
import type { Metadata } from "next";
import SubjectIcon from "@/components/SubjectIcon";

interface DeadlineDetailProps {
  params: Promise<{ id: string }>;
}

// ISR: Pre-render existing deadlines at build time; dynamic ones generated on demand
export const dynamicParams = true;

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: DeadlineDetailProps): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineWithSubject(id);

  if (!deadline) {
    return {
      title: "Không tìm thấy deadline",
    };
  }

  const title = `${deadline.title} - ${deadline.subject.name}`;
  const description = `${deadline.description} | Hạn nộp: ${formatDate(deadline.dueDate)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DeadlineDetailPage({ params }: DeadlineDetailProps) {
  const { id } = await params;
  const deadline = await getDeadlineWithSubject(id);

  if (!deadline) {
    notFound();
  }


  // JSON-LD Structured Data: BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "http://localhost:3000",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Deadlines",
        item: "http://localhost:3000/deadlines",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: deadline.subject.name,
        item: `http://localhost:3000/subjects/${deadline.subject.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: deadline.title,
        item: `http://localhost:3000/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <div className="container page">
      {/* JSON-LD Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <Link href="/deadlines">Deadlines</Link>
        <span className="sep">/</span>
        <Link href={`/subjects/${deadline.subject.slug}`}>
          {deadline.subject.name}
        </Link>
        <span className="sep">/</span>
        <span>Chi tiết</span>
      </nav>

      {/* Main detail content */}
      <div className="detail-body">
        {/* Left column: main info */}
        <div>
          <div className="card" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <span className="tag tag-subject" style={{ fontSize: "0.85rem" }}>
                <SubjectIcon slug={deadline.subject.slug} id={deadline.subject.id} /> {deadline.subject.name} ({deadline.subject.code})
              </span>
              <CountdownBadge dueDate={deadline.dueDate} />
            </div>

            <h1 className="detail-title">{deadline.title}</h1>

            <div className="detail-meta">
              <span className="tag tag-type">{getTypeLabel(deadline.type)}</span>
              <span className={`tag tag-priority-${deadline.priority}`}>
                Độ ưu tiên: {getPriorityLabel(deadline.priority)}
              </span>
            </div>

            <hr className="divider" />

            <section>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                <AntIcon name="fileText"  /> Mô tả yêu cầu bài nộp
              </h2>
              <p style={{ color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {deadline.description}
              </p>
            </section>

            <hr className="divider" />

            {/* Student action */}
            <UserDeadlineActions
              deadlineId={deadline.id}
              deadlineTitle={deadline.title}
            />
          </div>
        </div>

        {/* Right column: metadata card */}
        <aside>
          <div className="card">
            <h2 className="card-title"><AntIcon name="infoCircle"  /> Thông tin bài nộp</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>HẠN CHÓT</div>
                <div style={{ fontWeight: 600, color: "var(--danger)", marginTop: "2px" }}>
                  <AntIcon name="clockCircle"  /> {formatDate(deadline.dueDate)}
                </div>
              </div>

              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>MÔN HỌC</div>
                <div style={{ fontWeight: 500, marginTop: "2px" }}>
                  <Link href={`/subjects/${deadline.subject.slug}`}>
                    {deadline.subject.name}
                  </Link>
                </div>
              </div>

              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>MÃ HỌC PHẦN</div>
                <div style={{ fontWeight: 500, marginTop: "2px" }}>
                  {deadline.subject.code}
                </div>
              </div>

              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>NGÀY TẠO DEADLINE</div>
                <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  {formatDate(deadline.createdAt)}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                <Link
                  href="/deadlines"
                  className="btn btn-outline btn-sm"
                  style={{ width: "100%" }}
                >
                  <AntIcon name="left"  /> Tất cả deadline
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
