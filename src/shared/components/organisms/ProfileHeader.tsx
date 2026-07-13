import { useEffect, useState } from "react";
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
  month: "long",
  day: "numeric",
}).format(new Date());

export function ProfileHeader({ name, onboarded, bucket, onSaveName, onSkip }: ProfileHeaderProps) {
  const [nameModalOpen, setNameModalOpen] = useState(() => !onboarded);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    fetchQuoteOfTheDay(bucket).then(setQuote);
  }, [bucket]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Text variant="title">{name ? `Hi, ${name}` : "Hi there"}</Text>
        <IconButton aria-label="Edit name" onClick={() => setNameModalOpen(true)}>
          <Pencil className="h-4 w-4" strokeWidth={1.5} />
        </IconButton>
      </div>
      <Text variant="caption">Today, {todayLabel}</Text>
      <Text variant="caption" className="italic">
        {quote}
      </Text>

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
    </div>
  );
}
