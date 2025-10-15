import api from './axios';

export const register = async (email, password, role) => {
  const response = await api.post('/auth/register', { email, password, role });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};
