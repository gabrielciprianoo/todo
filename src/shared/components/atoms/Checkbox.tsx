type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  "aria-label"?: string;
};

export function Checkbox({ checked, onChange, ...props }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ease-out active:scale-90 ${
        checked ? "border-black bg-black" : "border-neutral-300 bg-transparent hover:border-black"
      }`}
      {...props}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 animate-pop fill-none stroke-white stroke-2">
          <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
