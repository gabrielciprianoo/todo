import { useState } from "react";
import { useTasks } from "./useTasks";
import { useProfile } from "../profile/useProfile";
import type { ProgressBucket } from "../profile/types";
import { ProgressBar } from "../../shared/components/molecules/ProgressBar";
import { ConfirmModal } from "../../shared/components/molecules/ConfirmModal";
import { ProfileHeader } from "../../shared/components/organisms/ProfileHeader";
import { TaskList } from "../../shared/components/organisms/TaskList";
import { AddTaskForm } from "../../shared/components/organisms/AddTaskForm";
import { Button } from "../../shared/components/atoms/Button";

export function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask, editTask, resetAll } = useTasks();
  const { name, onboarded, setName, skipOnboarding } = useProfile();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const completed = tasks.filter((task) => task.completed).length;
  const deletingTask = tasks.find((task) => task.id === deletingTaskId);

  const bucket: ProgressBucket =
    completed === 0 ? "empty" : completed === tasks.length ? "complete" : "in-progress";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-6 py-16">
      <ProfileHeader
        name={name}
        onboarded={onboarded}
        bucket={bucket}
        onSaveName={setName}
        onSkip={skipOnboarding}
      />

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
