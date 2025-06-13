import api from "./api";
import { Task, TaskCreate, SortOption } from "../types/Task";

interface GetTasksParams {
  sort_by?: SortOption;
  search?: string;
  top?: number;
}

export const getTasks = async (
  params: GetTasksParams = {}
): Promise<Task[]> => {
  const response = await api.get<Task[]>("/tasks", { params });
  return response.data;
};

export const createTask = async (taskData: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>("/tasks", taskData);
  return response.data;
};

export const updateTask = async (
  id: number,
  taskData: TaskCreate
): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
