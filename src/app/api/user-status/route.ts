import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserById } from "@/lib/data";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ authenticated: false });
  }

  const { searchParams } = new URL(req.url);
  const deadlineId = searchParams.get("deadlineId");

  const user = await getUserById(session.user.id);
  const isDone = deadlineId ? user?.completedDeadlines?.includes(deadlineId) ?? false : false;

  return NextResponse.json({
    authenticated: true,
    id: session.user.id,
    role: session.user.role,
    isDone,
  });
}
