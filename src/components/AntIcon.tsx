"use client";

import type { CSSProperties } from "react";
import {
  BookOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  ProfileOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SmileOutlined,
  TrophyOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

const icons = {
  book: BookOutlined,
  check: CheckOutlined,
  checkCircle: CheckCircleOutlined,
  clockCircle: ClockCircleOutlined,
  fileText: FileTextOutlined,
  infoCircle: InfoCircleOutlined,
  left: LeftOutlined,
  login: LoginOutlined,
  logout: LogoutOutlined,
  plus: PlusOutlined,
  profile: ProfileOutlined,
  right: RightOutlined,
  safetyCertificate: SafetyCertificateOutlined,
  smile: SmileOutlined,
  trophy: TrophyOutlined,
  unorderedList: UnorderedListOutlined,
  user: UserOutlined,
};

export type AntIconName = keyof typeof icons;

interface AntIconProps {
  name: AntIconName;
  style?: CSSProperties;
  className?: string;
}

export default function AntIcon({ name, style, className }: AntIconProps) {
  const Icon = icons[name];
  return <Icon style={style} className={className} />;
}
