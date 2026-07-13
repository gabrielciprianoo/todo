import { useState } from "react";
import { useTasks } from "./useTasks";
import { ProgressBar } from "../../shared/components/molecules/ProgressBar";
import { ConfirmModal } from "../../shared/components/molecules/ConfirmModal";
import { TaskList } from "../../shared/components/organisms/TaskList";
import { AddTaskForm } from "../../shared/components/organisms/AddTaskForm";
import { Button } from "../../shared/components/atoms/Button";
import { Text } from "../../shared/components/atoms/Text";

export function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask, editTask, resetAll } = useTasks();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const completed = tasks.filter((task) => task.completed).length;
  const deletingTask = tasks.find((task) => task.id === deletingTaskId);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-6 py-16">
      <Text variant="title">Today</Text>

      <ProgressBar completed={completed} total={tasks.length} />

      <AddTaskForm onAdd={addTask} />

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onRequestDelete={setDeletingTaskId}
        onEdit={editTask}
      />

      {tasks.length > 0 && (
        <div className="mt-auto pt-8 text-right">
          <Button variant="ghost" onClick={() => setResetConfirmOpen(true)}>
            Reset all
          </Button>
        </div>
      )}

      <ConfirmModal
        open={deletingTask !== undefined}
        title="Delete task?"
        message={`"${deletingTask?.text}" will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingTaskId(null)}
        onConfirm={() => {
          if (deletingTaskId) deleteTask(deletingTaskId);
          setDeletingTaskId(null);
        }}
      />

      <ConfirmModal
        open={resetConfirmOpen}
        title="Reset everything?"
        message="All tasks and progress will be permanently deleted. This cannot be undone."
        confirmLabel="Reset"
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          resetAll();
          setResetConfirmOpen(false);
        }}
      />
    </div>
  );
}
