import { TaskItem } from "../molecules/TaskItem";
import { Text } from "../atoms/Text";
import type { Task } from "../../../features/tasks/types";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRequestDelete: (id: string) => void;
};

export function TaskList({ tasks, onToggle, onRequestDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <Text variant="caption">No tasks yet. Add one to get started.</Text>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onRequestDelete} />
      ))}
    </ul>
  );
}
