import type { Task } from "./types";

export type TasksAction =
  | { type: "ADD_TASK"; text: string }
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "DELETE_TASK"; id: string }
  | { type: "EDIT_TASK"; id: string; text: string }
  | { type: "RESET_ALL" };

export function tasksReducer(state: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case "ADD_TASK": {
      const text = action.text.trim();
      if (!text) return state;
      const newTask: Task = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
      };
      return [...state, newTask];
    }
    case "TOGGLE_TASK":
      return state.map((task) =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.id);
    case "EDIT_TASK": {
      const text = action.text.trim();
      if (!text) return state;
      return state.map((task) =>
        task.id === action.id ? { ...task, text } : task
      );
    }
    case "RESET_ALL":
      return [];
    default:
      return state;
  }
}
