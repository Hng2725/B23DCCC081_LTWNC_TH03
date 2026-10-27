import AntIcon from "@/components/AntIcon";
import Link from "next/link";
import { getSubjects, getDeadlines } from "@/lib/data";
import type { Metadata } from "next";
import SubjectIcon from "@/components/SubjectIcon";

export const metadata: Metadata = {
  title: "Danh sách môn học",
  description: "Các môn học trong kỳ và danh sách deadline tương ứng",
};

export const dynamic = "force-static";

export default async function SubjectsPage() {
  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <span>Môn học</span>
      </div>

      <h1 className="page-title">Danh sách môn học</h1>
      <p className="page-subtitle">
        Xem tất cả các môn học và deadline theo từng môn
      </p>

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
              <h2 className="subject-card-name" style={{ fontSize: "1.05rem" }}>
                {sub.name}
              </h2>
              <div className="subject-card-code">Mã môn học: {sub.code}</div>
              <div className="subject-card-count">
                <AntIcon name="unorderedList"  /> Có {count} bài tập & deadline
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
