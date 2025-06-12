export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  priority: number;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  status?: string;
  priority?: number;
}

export type SortOption = 'title' | 'status' | 'created_at' | 'priority' | null;
