import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
        >
          <motion.div
            className="mx-4 w-full max-w-sm rounded-3xl bg-white p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
