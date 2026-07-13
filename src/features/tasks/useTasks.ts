import { useEffect, useReducer } from "react";
import { tasksReducer } from "./reducer";
import { loadTasks, saveTasks, clearTasks } from "./storage";

export function useTasks() {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (text: string) => dispatch({ type: "ADD_TASK", text });
  const toggleTask = (id: string) => dispatch({ type: "TOGGLE_TASK", id });
  const deleteTask = (id: string) => dispatch({ type: "DELETE_TASK", id });
  const editTask = (id: string, text: string) =>
    dispatch({ type: "EDIT_TASK", id, text });
  const resetAll = () => {
    clearTasks();
    dispatch({ type: "RESET_ALL" });
  };

  return { tasks, addTask, toggleTask, deleteTask, editTask, resetAll };
}
