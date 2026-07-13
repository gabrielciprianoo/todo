import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-out active:scale-95 disabled:opacity-40 disabled:pointer-events-none";

  const variants = {
    primary: "bg-black text-white shadow-sm shadow-black/10 hover:bg-neutral-800",
    ghost: "bg-transparent text-black hover:bg-black/5",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
