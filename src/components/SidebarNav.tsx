"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UnorderedListOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Tất cả deadline", icon: <UnorderedListOutlined />, exact: true },
  { href: "/dashboard/completed", label: "Đã hoàn thành", icon: <CheckCircleOutlined />, exact: false },
  { href: "/deadlines", label: "Deadlines công khai", icon: <GlobalOutlined />, exact: false },
  { href: "/subjects", label: "Danh sách môn học", icon: <BookOutlined />, exact: false },
];

export default function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <ul className="sidebar-nav">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={isActive ? "active" : ""}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}

      {isAdmin && (
        <li style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
          <Link
            href="/admin"
            className={pathname === "/admin" ? "active" : ""}
          >
            <span><SettingOutlined /></span>
            <span>Trang quản trị</span>
          </Link>
        </li>
      )}
    </ul>
  );
}
