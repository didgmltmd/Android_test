import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type Props = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-200 md:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
