import type { Role, Action } from "@/types";

// ─── Permission matrix ────────────────────────────────────────────────────────
const PERMISSIONS: Record<Action, Role[]> = {
  view_deadline: ["guest", "user", "admin"],
  mark_done: ["user", "admin"],
  add_deadline: ["admin"],
  delete_deadline: ["admin"],
};
// ─────────────────────────────────────────────────────────────────────────────

export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[action].includes(role);
}
