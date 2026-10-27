"use server";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { can } from "@/lib/permissions";
import {
  addDeadline,
  deleteDeadline,
  toggleDeadlineDone,
  getDeadlineById,
} from "@/lib/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Deadline } from "@/types";

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  try {
    const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email hoặc mật khẩu không đúng!" };
    }
    throw error;
  }
}


// ─── Add Deadline ─────────────────────────────────────────────────────────────
const addDeadlineSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  subjectId: z.string().min(1, "Vui lòng chọn môn học"),
  dueDate: z.string().min(1, "Vui lòng nhập hạn nộp"),
  type: z.enum(["assignment", "lab", "project", "exam"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

export async function addDeadlineAction(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session || !can(session.user.role, "add_deadline")) {
    return { error: "Không có quyền thực hiện." };
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    subjectId: formData.get("subjectId"),
    dueDate: formData.get("dueDate"),
    type: formData.get("type"),
    priority: formData.get("priority"),
  };

  const parsed = addDeadlineSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ." };
  }

  const deadline: Deadline = {
    id: Date.now().toString(),
    ...parsed.data,
    dueDate: new Date(parsed.data.dueDate).toISOString(),
    createdAt: new Date().toISOString(),
  };

  await addDeadline(deadline);
  revalidatePath("/deadlines");
  revalidatePath(`/deadlines/${deadline.id}`);

  return { success: true };
}

// ─── Delete Deadline ─────────────────────────────────────────────────────────
export async function deleteDeadlineAction(
  deadlineId: string
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session || !can(session.user.role, "delete_deadline")) {
    return { error: "Không có quyền thực hiện." };
  }

  if (!deadlineId || typeof deadlineId !== "string") {
    return { error: "ID không hợp lệ." };
  }

  const exists = await getDeadlineById(deadlineId);
  if (!exists) return { error: "Deadline không tồn tại." };

  await deleteDeadline(deadlineId);
  revalidatePath("/deadlines");
  revalidatePath(`/deadlines/${deadlineId}`);

  return { success: true };
}

// ─── Toggle Done ──────────────────────────────────────────────────────────────
export async function toggleDoneAction(
  deadlineId: string
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session || !can(session.user.role, "mark_done")) {
    return { error: "Vui lòng đăng nhập để đánh dấu." };
  }

  if (!deadlineId || typeof deadlineId !== "string") {
    return { error: "ID không hợp lệ." };
  }

  await toggleDeadlineDone(session.user.id, deadlineId);
  revalidatePath("/dashboard");

  return { success: true };
}
