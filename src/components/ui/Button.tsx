import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
  }
>;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#3182F6] text-white hover:bg-[#256fe0] focus-visible:ring-[#3182F6]",
  secondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-300",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300",
  ghost:
    "bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-200",
};

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
