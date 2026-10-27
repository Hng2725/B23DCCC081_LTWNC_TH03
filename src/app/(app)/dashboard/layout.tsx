import { auth } from "@/auth";
import SidebarNav from "@/components/SidebarNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard sinh viên",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div style={{ padding: "0 1.25rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {session?.user?.name || "Sinh viên"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {session?.user?.email}
          </div>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <SidebarNav isAdmin={isAdmin} />
        </div>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
