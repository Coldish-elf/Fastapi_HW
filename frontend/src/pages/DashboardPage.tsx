import { useAuth } from "@/hooks/useAuth";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { Task, TaskCreate, SortOption } from "@/types/Task";
import Header from "@/components/layout/Header";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/layout/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const [topTasks, setTopTasks] = useState<number | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const {
    data: tasks,
    isLoading,
    refetch,
  } = useTasks(sortBy, search, topTasks);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const stabilizedTasks = useMemo(() => tasks || [], [tasks]);

  useEffect(() => {
    console.log("DashboardPage rendered");
  }, []);

  useEffect(() => {
    console.log("Tasks updated:", { tasks, stabilizedTasks, isLoading });
  }, [tasks, stabilizedTasks, isLoading]);

  const handleCreateTask = (data: TaskCreate) => {
    createTask.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        refetch();
      },
    });
  };

  const handleUpdateTask = (data: TaskCreate) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, task: data },
        {
          onSuccess: () => {
            setEditingTask(null);
            refetch();
          },
        }
      );
    }
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      deleteTask.mutate(taskToDelete, {
        onSuccess: () => {
          setTaskToDelete(null);
          setIsConfirmDeleteOpen(false);
          refetch();
        },
      });
    }
  };

  const confirmDelete = (id: number) => {
    setTaskToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <Header onSearchChange={setSearch} searchValue={search} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {user?.username
              ? `Задачи пользователя ${user.username}`
              : "Мои задачи"}
          </h1>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Создать задачу
          </Button>
        </div>

        <div className="mb-6 bg-light-foreground dark:bg-dark-background dark:border dark:border-slate-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="w-full sm:w-auto">
              <label className="block mb-1.5 text-sm font-medium text-light-text dark:text-dark-text">
                Сортировка
              </label>
              <select
                className="block w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md text-sm 
                           bg-light-muted dark:bg-dark-muted 
                           text-light-text dark:text-dark-text 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                           dark:focus:ring-primary dark:focus:border-primary"
                value={sortBy || ""}
                onChange={(e) =>
                  setSortBy((e.target.value as SortOption) || null)
                }
              >
                <option value="">Без сортировки</option>
                <option value="title">По названию</option>
                <option value="status">По статусу</option>
                <option value="created_at">По дате создания</option>
                <option value="priority">По приоритету</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block mb-1.5 text-sm font-medium text-light-text dark:text-dark-text">
                ТОП задач:{" "}
                <span className="font-semibold text-primary">
                  {topTasks || "все"}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={topTasks || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setTopTasks(value === 0 ? undefined : value);
                }}
                className="w-full h-2 bg-light-border dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary"
              />
            </div>
          </div>
        </div>

        {isLoading || !tasks ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-dark-primary"></div>
          </div>
        ) : stabilizedTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {stabilizedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskCard
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={confirmDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-dark-text">
              Задачи не найдены
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Начните с создания новой задачи.
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Создать задачу
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      <Modal
        key="create-modal"
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Создать новую задачу"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={createTask.isLoading}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        key="edit-modal"
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Редактировать задачу"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            isLoading={updateTask.isLoading}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        key="delete-modal"
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setTaskToDelete(null);
        }}
        title="Удалить задачу"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Вы уверены, что хотите удалить эту задачу? Это действие нельзя
            отменить.
          </p>
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <Button
            variant="ghost"
            onClick={() => {
              setIsConfirmDeleteOpen(false);
              setTaskToDelete(null);
            }}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteTask}
            isLoading={deleteTask.isLoading}
          >
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;