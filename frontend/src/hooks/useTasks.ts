import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { TaskCreate, SortOption } from '../types/Task';
import toast from 'react-hot-toast';

export const useTasks = (sortBy?: SortOption, search?: string, top?: number) => {
  return useQuery(
    ['tasks', sortBy, search, top],
    () => getTasks({ sort_by: sortBy, search, top }),
    {
      keepPreviousData: true,
    }
  );
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (task: TaskCreate) => createTask(task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
        toast.success('Задача создана');
      },
    }
  );
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, task }: { id: number; task: TaskCreate }) => updateTask(id, task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
        toast.success('Задача обновлена');
      },
    }
  );
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => deleteTask(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
        toast.success('Задача удалена');
      },
    }
  );
};
