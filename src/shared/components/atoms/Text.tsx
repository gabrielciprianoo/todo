import type { ReactNode } from "react";

type TextProps = {
  variant?: "title" | "body" | "caption";
  className?: string;
  children: ReactNode;
};

const variants = {
  title: "text-3xl font-semibold tracking-tight text-black",
  body: "text-base text-black",
  caption: "text-sm text-neutral-400",
};

export function Text({ variant = "body", className = "", children }: TextProps) {
  return <p className={`${variants[variant]} ${className}`}>{children}</p>;
}
