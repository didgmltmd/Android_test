import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type Props = PropsWithChildren<{
  tone?: "blue" | "gray" | "green" | "amber" | "red";
  className?: string;
}>;

const toneClass = {
  blue: "bg-blue-50 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

export function Badge({ children, tone = "gray", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
