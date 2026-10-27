import fs from "fs/promises";
import path from "path";
import type { Deadline, Subject, User, DeadlineWithSubject } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJSON<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Subjects ─────────────────────────────────────────────────────────────────
export async function getSubjects(): Promise<Subject[]> {
  return readJSON<Subject[]>("subjects.json");
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug) ?? null;
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.id === id) ?? null;
}

// ─── Deadlines ────────────────────────────────────────────────────────────────
export async function getDeadlines(): Promise<Deadline[]> {
  return readJSON<Deadline[]>("deadlines.json");
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const deadlines = await getDeadlines();
  return deadlines.find((d) => d.id === id) ?? null;
}

export async function getDeadlinesWithSubject(): Promise<DeadlineWithSubject[]> {
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);
  return deadlines.map((d) => {
    const subject = subjects.find((s) => s.id === d.subjectId)!;
    return { ...d, subject };
  });
}

export async function getDeadlineWithSubject(
  id: string
): Promise<DeadlineWithSubject | null> {
  const [deadline, subjects] = await Promise.all([
    getDeadlineById(id),
    getSubjects(),
  ]);
  if (!deadline) return null;
  const subject = subjects.find((s) => s.id === deadline.subjectId)!;
  return { ...deadline, subject };
}

export async function getDeadlinesBySubject(
  subjectId: string
): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectId === subjectId);
}

export async function addDeadline(deadline: Deadline): Promise<void> {
  const deadlines = await getDeadlines();
  deadlines.push(deadline);
  await writeJSON("deadlines.json", deadlines);
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await getDeadlines();
  const index = deadlines.findIndex((d) => d.id === id);
  if (index === -1) return false;
  deadlines.splice(index, 1);
  await writeJSON("deadlines.json", deadlines);
  return true;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function getUsers(): Promise<User[]> {
  return readJSON<User[]>("users.json");
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email === email) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function toggleDeadlineDone(
  userId: string,
  deadlineId: string
): Promise<boolean> {
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  const idx = user.completedDeadlines.indexOf(deadlineId);
  if (idx === -1) {
    user.completedDeadlines.push(deadlineId);
  } else {
    user.completedDeadlines.splice(idx, 1);
  }
  await writeJSON("users.json", users);
  return true;
}
