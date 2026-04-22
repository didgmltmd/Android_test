import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

type Props = PropsWithChildren<{
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  panelClassName?: string;
}>;

export function Modal({
  open,
  title,
  description,
  onClose,
  panelClassName,
  children,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/35 p-2 backdrop-blur-sm md:items-center md:justify-center md:p-4">
      <div
        className={cn(
          "flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[28px] bg-white p-5 shadow-soft md:p-6",
          panelClassName,
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-toss-text">{title}</h2>
            {description ? (
              <p className="text-sm leading-relaxed text-toss-muted">
                {description}
              </p>
            ) : null}
          </div>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
