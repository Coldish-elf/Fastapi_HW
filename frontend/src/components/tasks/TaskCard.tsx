import React from 'react';
import { Task } from '@/types/Task';
import { motion } from 'framer-motion';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const statusColor = {
    'в ожидании': 'bg-status-waiting',
    'в работе': 'bg-status-progress',
    'завершено': 'bg-status-completed',
  }[task.status] || 'bg-gray-400';

  const priorityBarStyle = `absolute left-0 top-0 bottom-0 w-1.5 ${
    task.priority >= 8 ? 'bg-red-600' : 
    task.priority >= 5 ? 'bg-orange-500' : 
    task.priority >= 3 ? 'bg-yellow-500' : 'bg-blue-400'
  }`;

  const formattedDate = task.created_at ? 
    formatDistanceToNow(parseISO(task.created_at), { 
      addSuffix: true, 
      locale: ru 
    }) : '';

  const exactDate = task.created_at ? 
    format(parseISO(task.created_at), 'dd.MM.yyyy HH:mm', { locale: ru }) : '';

  return (
    <motion.div 
      className="card relative pl-6 p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className={priorityBarStyle} />
      
      <div className="flex justify-between items-start">
        <h3 className="text-md font-semibold line-clamp-2 mb-2" title={task.title}>
          {task.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${statusColor}`}>
          {task.status}
        </span>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={task.description}>
          {task.description}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500" title={exactDate}>{formattedDate}</span>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(task)}
            className="text-sm text-primary hover:text-primary-light transition-colors"
          >
            Редактировать
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
