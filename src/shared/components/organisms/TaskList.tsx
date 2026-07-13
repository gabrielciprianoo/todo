import { AnimatePresence } from "framer-motion";
import { TaskItem } from "../molecules/TaskItem";
import { Text } from "../atoms/Text";
import type { Task } from "../../../features/tasks/types";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRequestDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export function TaskList({ tasks, onToggle, onRequestDelete, onEdit }: TaskListProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {tasks.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <Text variant="caption">No tasks yet. Add one to get started.</Text>
        </div>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onRequestDelete}
                onEdit={onEdit}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
