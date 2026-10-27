"use client";

import {
  GlobalOutlined,
  DatabaseOutlined,
  WifiOutlined,
  ProjectOutlined,
  BookOutlined,
} from "@ant-design/icons";
import React from "react";

interface SubjectIconProps {
  slug?: string;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function SubjectIcon({ slug, id, style, className }: SubjectIconProps) {
  if (slug === "lap-trinh-web" || id === "s1") {
    return <GlobalOutlined style={{ color: "#3b82f6", ...style }} className={className} />;
  }
  if (slug === "co-so-du-lieu" || id === "s2") {
    return <DatabaseOutlined style={{ color: "#10b981", ...style }} className={className} />;
  }
  if (slug === "mang-may-tinh" || id === "s3") {
    return <WifiOutlined style={{ color: "#f59e0b", ...style }} className={className} />;
  }
  if (slug === "phan-tich-thiet-ke-he-thong" || id === "s4") {
    return <ProjectOutlined style={{ color: "#8b5cf6", ...style }} className={className} />;
  }
  return <BookOutlined style={style} className={className} />;
}
