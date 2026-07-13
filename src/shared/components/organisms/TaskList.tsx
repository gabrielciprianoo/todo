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
  if (tasks.length === 0) {
    return <Text variant="caption">No tasks yet. Add one to get started.</Text>;
  }

  return (
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
  );
}
