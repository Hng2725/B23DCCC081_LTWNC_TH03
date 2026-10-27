"use client";

import { useEffect, useState } from "react";
import { getDaysLeft, getStatusLabel } from "@/lib/utils";

interface CountdownBadgeProps {
  dueDate: string;
}

export default function CountdownBadge({ dueDate }: CountdownBadgeProps) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(getDaysLeft(dueDate));
    const interval = setInterval(() => {
      setDays(getDaysLeft(dueDate));
    }, 60_000);
    return () => clearInterval(interval);
  }, [dueDate]);

  if (days === null) return null;

  let cls = "countdown ok";
  if (days < 0) cls = "countdown overdue";
  else if (days <= 3) cls = "countdown soon";

  return <span className={cls}>{getStatusLabel(days)}</span>;
}
