import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
          onClick={onCancel}
        >
          <motion.div
            className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <Text variant="body" className="font-semibold">
              {title}
            </Text>
            <Text variant="caption" className="mt-1">
              {message}
            </Text>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
