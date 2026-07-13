import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";

type NameModalProps = {
  open: boolean;
  initialName: string;
  onSave: (name: string) => void;
  onSkip: () => void;
};

export function NameModal({ open, initialName, onSave, onSkip }: NameModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-scale-in">
        <Text variant="body" className="font-semibold">
          What should we call you?
        </Text>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave(name.trim());
          }}
          autoFocus
          placeholder="Your name"
          className="mt-4 w-full rounded-lg border border-neutral-200 px-3 py-2 text-base text-black outline-none focus:border-black"
        />
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
          <Button variant="primary" onClick={() => onSave(name.trim())}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
