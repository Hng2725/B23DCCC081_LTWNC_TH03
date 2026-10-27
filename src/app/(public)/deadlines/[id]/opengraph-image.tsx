import { ImageResponse } from "next/og";
import { getDeadlineWithSubject } from "@/lib/data";
import { formatDate, getTypeLabel, getPriorityLabel } from "@/lib/utils";

export const runtime = "nodejs";

export const alt = "Deadline Hub Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadlineWithSubject(id);

  const title = deadline?.title || "Chi tiết Deadline";
  const subjectName = deadline?.subject?.name || "Môn học PTIT";
  const dueDate = deadline ? formatDate(deadline.dueDate) : "";
  const type = deadline ? getTypeLabel(deadline.type) : "Bài tập";
  const priority = deadline ? getPriorityLabel(deadline.priority) : "Bình thường";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "28px", fontWeight: "bold" }}>
            <span>Deadline Hub PTIT</span>
          </div>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              background: "#3b82f6",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            {subjectName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "#334155",
                fontSize: "18px",
              }}
            >
              Loại: {type}
            </span>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "#ef4444",
                fontSize: "18px",
              }}
            >
              Mức độ: {priority}
            </span>
          </div>

          <h1
            style={{
              fontSize: "46px",
              fontWeight: "800",
              lineHeight: 1.2,
              margin: 0,
              maxWidth: "1000px",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #334155",
            paddingTop: "24px",
            fontSize: "22px",
            color: "#94a3b8",
          }}
        >
          <div>Hạn nộp: <strong style={{ color: "#ffffff" }}>{dueDate}</strong></div>
          <div style={{ color: "#38bdf8" }}>deadline-hub.ptit.edu.vn</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
