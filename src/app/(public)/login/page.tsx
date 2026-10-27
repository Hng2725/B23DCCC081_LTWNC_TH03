import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào cổng Deadline Hub PTIT",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Đăng nhập tài khoản</h1>
        <p className="login-subtitle">
          Dành cho sinh viên và ban cán sự lớp PTIT
        </p>

        <Suspense fallback={<p style={{ fontSize: "0.85rem" }}>Đang tải form...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
