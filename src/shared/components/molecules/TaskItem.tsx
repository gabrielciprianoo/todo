import { X } from "lucide-react";
import { Checkbox } from "../atoms/Checkbox";
import { IconButton } from "../atoms/IconButton";
import type { Task } from "../../../features/tasks/types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex animate-task-in items-center gap-3 border-b border-neutral-100 py-3 last:border-b-0">
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as ${task.completed ? "pending" : "completed"}`}
      />
      <span
        className={`flex-1 text-base transition-colors duration-200 ${
          task.completed ? "text-neutral-300 line-through" : "text-black"
        }`}
      >
        {task.text}
      </span>
      <IconButton aria-label={`Delete "${task.text}"`} onClick={() => onDelete(task.id)}>
        <X className="h-4 w-4" strokeWidth={1.5} />
      </IconButton>
    </li>
  );
}
