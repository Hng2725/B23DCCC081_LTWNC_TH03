import type { Deadline } from "@/types";

export function getDaysLeft(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusLabel(days: number): string {
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  if (days === 0) return "Hôm nay là hạn!";
  return `Còn ${days} ngày`;
}

export function getTypeLabel(type: Deadline["type"]): string {
  const map: Record<Deadline["type"], string> = {
    assignment: "Bài tập",
    lab: "Lab",
    project: "Bài tập lớn",
    exam: "Kiểm tra",
  };
  return map[type];
}

export function getPriorityLabel(priority: Deadline["priority"]): string {
  const map: Record<Deadline["priority"], string> = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    urgent: "Khẩn cấp",
  };
  return map[priority];
}
