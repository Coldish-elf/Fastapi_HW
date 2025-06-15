import React from "react";
import { Task } from "@/types/Task";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const statusColor =
    {
      "в ожидании": "bg-status-waiting",
      "в работе": "bg-status-progress",
      завершено: "bg-status-completed",
    }[task.status] || "bg-gray-400";

  const priorityBarStyle = `absolute left-0 top-0 bottom-0 w-1.5 ${
    task.priority >= 8
      ? "bg-red-600"
      : task.priority >= 5
      ? "bg-orange-500"
      : task.priority >= 3
      ? "bg-yellow-500"
      : "bg-blue-400"
  }`;

  const getLocalDate = (isoString: string) => {
    const utcString = isoString.endsWith("Z") ? isoString : `${isoString}Z`;
    return parseISO(utcString);
  };

  const formattedDate = task.created_at
    ? formatDistanceToNow(getLocalDate(task.created_at), {
        addSuffix: true,
        locale: ru,
      })
    : "";

  const exactDate = task.created_at
    ? format(getLocalDate(task.created_at), "dd.MM.yyyy HH:mm", { locale: ru })
    : "";

  return (
    <div className="relative pl-6 p-4 shadow-sm dark:bg-dark-card dark:border-dark-border">
      <div className={priorityBarStyle} />

      <div className="flex justify-between items-start">
        <h3
          className="text-md font-semibold line-clamp-2 mb-2 text-text dark:text-dark-text"
          title={task.title}
        >
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full text-white ${statusColor}`}
        >
          {task.status}
        </span>
      </div>

      {task.description && (
        <p
          className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
          title={task.description}
        >
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center mt-2">
        <span
          className="text-xs text-gray-500 dark:text-gray-400"
          title={exactDate}
        >
          {formattedDate}
        </span>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-sm text-primary dark:text-dark-primary hover:text-primary-light dark:hover:text-dark-primary-light"
          >
            Редактировать
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
