import Link from "next/link";
import { getDeadlinesWithSubject, getSubjects } from "@/lib/data";
import FilterDeadlines from "@/components/FilterDeadlines";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả Deadline",
  description: "Danh sách đầy đủ các deadline của lớp, cập nhật liên tục với ISR",
};

// ISR strategy: Revalidate every 60 seconds
export const revalidate = 60;

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([
    getDeadlinesWithSubject(),
    getSubjects(),
  ]);

  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="sep">/</span>
        <span>Deadlines</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Danh sách Deadline công khai</h1>
          <p className="page-subtitle">
            Cập nhật tự động (ISR 60s). Tổng cộng {deadlines.length} bài tập và đồ án cần nộp.
          </p>
        </div>
      </div>

      <FilterDeadlines
        initialDeadlines={deadlines}
        subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
