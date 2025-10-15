import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { getTaskById, updateTask, deleteTask, downloadDocument, deleteDocument } from '../api/taskApi';
import { getUsers } from '../api/userApi';
import { Calendar, User, AlertCircle, FileText, Download, Trash2, Edit, X } from 'lucide-react';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
    assignedToId: '',
  });
  
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchTask();
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const data = await getTaskById(id);
      setTask(data);
      setFormData({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        assignedToId: data.assignedToId || '',
      });
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers({ page: 0, size: 100 });
      setUsers(data.content);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('status', formData.status);
      data.append('priority', formData.priority);
      data.append('dueDate', formData.dueDate);
      if (formData.assignedToId) {
        data.append('assignedToId', formData.assignedToId);
      }
      
      files.forEach((file) => {
        data.append('files', file);
      });

      await updateTask(id, data);
      setShowEditModal(false);
      setFiles([]);
      fetchTask();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        navigate('/tasks');
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const blob = await downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId);
        fetchTask();
      } catch (error) {
        alert('Failed to delete document');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = 3 - (task?.documents?.length || 0);
    
    if (selectedFiles.length > remainingSlots) {
      setError(`Maximum ${remainingSlots} more file(s) allowed`);
      return;
    }
    
    const allPdf = selectedFiles.every(file => file.type === 'application/pdf');
    if (!allPdf) {
      setError('Only PDF files are allowed');
      return;
    }
    
    setFiles(selectedFiles);
    setError('');
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Task not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[task.status]}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit size={20} />
                <span>Edit</span>
              </button>
              
              <button
                onClick={handleDeleteTask}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 size={20} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-600">{task.description || 'No description'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Calendar size={20} />
                <span className="font-semibold">Due Date:</span>
              </div>
              <p className="text-gray-800">{task.dueDate}</p>
            </div>

            {task.assignedToEmail && (
              <div>
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <User size={20} />
                  <span className="font-semibold">Assigned To:</span>
                </div>
                <p className="text-gray-800">{task.assignedToEmail}</p>
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <User size={20} />
                <span className="font-semibold">Created By:</span>
              </div>
              <p className="text-gray-800">{task.createdByEmail}</p>
            </div>
          </div>

          {task.documents && task.documents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Attached Documents</h2>
              <div className="space-y-2">
                {task.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-red-600" size={24} />
                      <div>
                        <p className="font-medium text-gray-800">{doc.fileName}</p>
                        <p className="text-sm text-gray-500">{(doc.fileSize / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadDocument(doc.id, doc.fileName)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateTask}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {users.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Assign To</label>
                  <select
                    value={formData.assignedToId}
                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.email}</option>
                    ))}
                  </select>
                </div>
              )}

              {task.documents.length < 3 && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Add More Documents (PDF only, {3 - task.documents.length} remaining)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {files.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">{files.length} file(s) selected</p>
                  )}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
