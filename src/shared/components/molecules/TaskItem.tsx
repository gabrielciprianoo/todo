import { useRef, useState } from "react";
import { Pencil, X } from "lucide-react";
import { Checkbox } from "../atoms/Checkbox";
import { IconButton } from "../atoms/IconButton";
import type { Task } from "../../../features/tasks/types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setDraft(task.text);
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const save = () => {
    const text = draft.trim();
    if (!text) return;
    onEdit(task.id, text);
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(task.text);
    setIsEditing(false);
  };

  return (
    <li className="flex animate-task-in items-center gap-3 border-b border-neutral-100 py-3 last:border-b-0">
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as ${task.completed ? "pending" : "completed"}`}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          autoFocus
          className="flex-1 border-b border-black bg-transparent text-base text-black outline-none"
        />
      ) : (
        <span
          className={`flex-1 text-base transition-colors duration-200 ${
            task.completed ? "text-neutral-300 line-through" : "text-black"
          }`}
        >
          {task.text}
        </span>
      )}
      {!isEditing && (
        <IconButton aria-label={`Edit "${task.text}"`} onClick={startEditing}>
          <Pencil className="h-4 w-4" strokeWidth={1.5} />
        </IconButton>
      )}
      <IconButton aria-label={`Delete "${task.text}"`} onClick={() => onDelete(task.id)}>
        <X className="h-4 w-4" strokeWidth={1.5} />
      </IconButton>
    </li>
  );
}
