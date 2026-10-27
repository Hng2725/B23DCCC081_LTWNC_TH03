import AntIcon from "@/components/AntIcon";
import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/auth";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="site-header">
      <Link href="/" className="logo">
        <AntIcon name="profile" style={{ color: "var(--primary)" }}  />
        <span>Deadline Hub</span>
      </Link>

      <nav>
        <Link href="/" className="nav-link">Trang chủ</Link>
        <Link href="/deadlines" className="nav-link">Deadlines</Link>
        <Link href="/subjects" className="nav-link">Môn học</Link>
        {user && <Link href="/dashboard" className="nav-link">Dashboard</Link>}
        {user?.role === "admin" && (
          <Link href="/admin" className="nav-link">Admin</Link>
        )}
      </nav>

      <div className="header-actions">
        {user ? (
          <>
            <div className="user-badge">
              {user.role === "admin" ? (
                <AntIcon name="safetyCertificate" style={{ color: "#d97706" }}  />
              ) : (
                <AntIcon name="user" style={{ color: "var(--primary)" }}  />
              )}
              <span>{user.name}</span>
              <span className={`role-tag ${user.role === "admin" ? "admin" : ""}`}>
                {user.role === "admin" ? "Lớp trưởng" : "Sinh viên"}
              </span>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="btn btn-outline btn-sm">
                <AntIcon name="logout"  />
                <span>Đăng xuất</span>
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm">
            <AntIcon name="login"  />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
}
