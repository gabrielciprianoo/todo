import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Text } from "../atoms/Text";
import { IconButton } from "../atoms/IconButton";
import { NameModal } from "../molecules/NameModal";
import { fetchQuoteOfTheDay } from "../../../features/profile/quotesApi";
import type { ProgressBucket } from "../../../features/profile/types";

type ProfileHeaderProps = {
  name: string;
  onboarded: boolean;
  bucket: ProgressBucket;
  onSaveName: (name: string) => void;
  onSkip: () => void;
};

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
}).format(new Date());

export function ProfileHeader({ name, onboarded, bucket, onSaveName, onSkip }: ProfileHeaderProps) {
  const [nameModalOpen, setNameModalOpen] = useState(() => !onboarded);
  const [quote, setQuote] = useState("");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetchQuoteOfTheDay(bucket).then(setQuote);
  }, [bucket]);

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Text variant="title">{name ? `Hi, ${name}` : "Hi there"}</Text>
          <IconButton aria-label="Edit name" onClick={() => setNameModalOpen(true)}>
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </IconButton>
        </div>
        <p className="text-base text-neutral-400 lg:text-lg">{todayLabel}</p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={quote}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
          className="border-l-2 border-neutral-200 py-1 pl-4"
        >
          <p className="text-lg italic text-neutral-500 lg:text-xl">{quote}</p>
        </motion.div>
      </AnimatePresence>

      <NameModal
        open={nameModalOpen}
        initialName={name}
        onSave={(newName) => {
          onSaveName(newName);
          setNameModalOpen(false);
        }}
        onSkip={() => {
          onSkip();
          setNameModalOpen(false);
        }}
      />
    </motion.div>
  );
}
