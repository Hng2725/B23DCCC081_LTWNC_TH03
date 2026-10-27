export type Role = "admin" | "user" | "guest";

export type Action =
  | "view_deadline"
  | "mark_done"
  | "add_deadline"
  | "delete_deadline";

export interface Subject {
  id: string;
  slug: string;
  name: string;
  code: string;
  color: string;
  icon: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string;
  type: "assignment" | "lab" | "project" | "exam";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  completedDeadlines: string[];
}

export interface DeadlineWithSubject extends Deadline {
  subject: Subject;
}
