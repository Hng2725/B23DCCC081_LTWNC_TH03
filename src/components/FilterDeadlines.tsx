"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { DeadlineWithSubject } from "@/types";
import CountdownBadge from "./CountdownBadge";
import SubjectIcon from "./SubjectIcon";
import { formatDate, getTypeLabel, getPriorityLabel } from "@/lib/utils";
import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";

interface FilterDeadlinesProps {
  initialDeadlines: DeadlineWithSubject[];
  subjects: { id: string; name: string; slug?: string }[];
}

export default function FilterDeadlines({
  initialDeadlines,
  subjects,
}: FilterDeadlinesProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    return initialDeadlines.filter((item) => {
      const matchSubject =
        selectedSubject === "all" || item.subjectId === selectedSubject;
      const matchType = selectedType === "all" || item.type === selectedType;
      const matchSearch =
        search.trim() === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.name.toLowerCase().includes(search.toLowerCase());
      return matchSubject && matchType && matchSearch;
    });
  }, [initialDeadlines, selectedSubject, selectedType, search]);

  return (
    <div>
      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
        <div style={{ position: "relative", maxWidth: "260px", width: "100%" }}>
          <SearchOutlined
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm deadline, môn học..."
            className="form-control"
            style={{ paddingLeft: "2rem" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`filter-btn ${selectedSubject === "all" ? "active" : ""}`}
            onClick={() => setSelectedSubject("all")}
          >
            Tất cả môn
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              type="button"
              className={`filter-btn ${selectedSubject === sub.id ? "active" : ""}`}
              onClick={() => setSelectedSubject(sub.id)}
            >
              {sub.name}
            </button>
          ))}
        </div>

        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`filter-btn ${selectedType === "all" ? "active" : ""}`}
            onClick={() => setSelectedType("all")}
          >
            Tất cả loại
          </button>
          {(["assignment", "lab", "project", "exam"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`filter-btn ${selectedType === t ? "active" : ""}`}
              onClick={() => setSelectedType(t)}
            >
              {getTypeLabel(t)}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines List */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <p className="empty-state-icon">
            <SearchOutlined style={{ fontSize: "2.5rem", color: "var(--text-muted)" }} />
          </p>
          <p className="empty-state-text">Không tìm thấy deadline phù hợp</p>
        </div>
      ) : (
        <div className="deadline-list">
          {filtered.map((item) => (
            <article key={item.id} className={`deadline-card ${item.priority === "urgent" ? "urgent-priority" : ""}`}>
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
                    <SubjectIcon slug={item.subject.slug} id={item.subject.id} style={{ marginRight: "4px" }} />
                    {item.subject.name}
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
                  <span>Chi tiết</span>
                  <ArrowRightOutlined style={{ fontSize: "0.75rem" }} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
