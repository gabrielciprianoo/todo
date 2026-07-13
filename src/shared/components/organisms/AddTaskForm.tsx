import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../atoms/Button";

type AddTaskFormProps = {
  onAdd: (text: string) => void;
};

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [text, setText] = useState("");
  const trimmed = text.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task…"
        className="flex-1 rounded-full border border-neutral-200 px-4 py-3 text-sm text-black outline-none transition-colors duration-200 placeholder:text-neutral-300 focus:border-black"
      />
      <Button type="submit" disabled={!trimmed}>
        Add
      </Button>
    </form>
  );
}
