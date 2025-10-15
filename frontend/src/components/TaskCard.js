import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, AlertCircle } from 'lucide-react';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  const statusColors = {
    TODO: 'bg-gray-200 text-gray-800',
    IN_PROGRESS: 'bg-blue-200 text-blue-800',
    DONE: 'bg-green-200 text-green-800',
  };

  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
          {task.status}
        </span>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{task.dueDate}</span>
            </div>
          )}
          
          {task.assignedToEmail && (
            <div className="flex items-center space-x-1">
              <User size={16} />
              <span>{task.assignedToEmail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
