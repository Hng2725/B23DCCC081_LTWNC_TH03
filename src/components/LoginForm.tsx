"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions";
import { ReadOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fillAdmin = () => {
    setEmail("admin@ptit.edu.vn");
    setPassword("admin123");
  };

  const fillUser = () => {
    setEmail("sv@ptit.edu.vn");
    setPassword("sv123456");
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state?.error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {state.error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email sinh viên / lớp trưởng
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="form-control"
          placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="form-control"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary"
        style={{ width: "100%", marginTop: "0.5rem" }}
      >
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      {/* Quick accounts for reviewer */}
      <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          Tài khoản kiểm thử (click để điền nhanh):
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
          <button
            type="button"
            onClick={fillAdmin}
            className="btn btn-outline btn-sm"
            style={{ fontSize: "0.75rem", justifyContent: "flex-start" }}
          >
            <SafetyCertificateOutlined />
            <span>Admin: admin@ptit.edu.vn (admin123)</span>
          </button>
          <button
            type="button"
            onClick={fillUser}
            className="btn btn-outline btn-sm"
            style={{ fontSize: "0.75rem", justifyContent: "flex-start" }}
          >
            <ReadOutlined />
            <span>Sinh viên: sv@ptit.edu.vn (sv123456)</span>
          </button>
        </div>
      </div>
    </form>
  );
}
