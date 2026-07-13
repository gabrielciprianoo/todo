import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className = "", ...props }: IconButtonProps) {
  return (
    <button
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-all duration-200 ease-out hover:bg-black/5 hover:text-black active:scale-90 ${className}`}
      {...props}
    />
  );
}
