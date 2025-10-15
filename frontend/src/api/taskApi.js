import api from './axios';

export const getTasks = async (params) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (formData) => {
  const response = await api.post('/tasks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateTask = async (id, formData) => {
  const response = await api.put(`/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};

export const downloadDocument = async (documentId) => {
  const response = await api.get(`/tasks/documents/${documentId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteDocument = async (documentId) => {
  await api.delete(`/tasks/documents/${documentId}`);
};
