import React from "react";
import { useForm } from "react-hook-form";
import { Task, TaskCreate } from "@/types/Task";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskCreate) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreate>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "в ожидании",
      priority: task?.priority || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Название задачи"
        placeholder="Введите название задачи"
        fullWidth
        error={errors.title?.message}
        {...register("title", {
          required: "Название задачи обязательно",
        })}
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-text dark:text-dark-text">
          Описание
        </label>
        <textarea
          className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border rounded-md 
                   border-gray-300 dark:border-dark-border text-sm text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-primary dark:focus:border-dark-primary transition-colors duration-300"
          rows={3}
          placeholder="Введите описание задачи"
          {...register("description")}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-text dark:text-dark-text">
          Статус
        </label>
        <select
          className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border rounded-md 
                   border-gray-300 dark:border-dark-border text-sm text-text dark:text-dark-text
                   focus:outline-none focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-primary dark:focus:border-dark-primary transition-colors duration-300"
          {...register("status")}
        >
          <option value="в ожидании">В ожидании</option>
          <option value="в работе">В работе</option>
          <option value="завершено">Завершено</option>
        </select>
      </div>

      <div>
        <label className="flex justify-between mb-1 text-sm font-medium text-text dark:text-dark-text">
          <span>Приоритет: </span>
          <output
            className="text-primary dark:text-dark-primary font-bold"
            id="priority-value"
          >
            {task?.priority || 0}
          </output>{" "}
          {/* Initialize output */}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-dark-primary"
          {...register("priority", { valueAsNumber: true })}
          onChange={(e) => {
            document.getElementById("priority-value")!.textContent =
              e.target.value;
          }}
          defaultValue={task?.priority || 0}
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Низкий</span>
          <span>Высокий</span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? "Сохранить" : "Создать"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
