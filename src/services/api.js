import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Отримати весь інвентар
export const fetchInventory = () => api.get('/inventory');

// Отримати один елемент
export const fetchInventoryItem = (id) => api.get(`/inventory/${id}`);

// Створити новий (multipart/form-data)
export const createInventory = (formData) => api.post('/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Оновити текстові поля (JSON)
export const updateInventoryText = (id, data) => api.put(`/inventory/${id}`, data);

// Оновити фото (multipart)
export const updateInventoryPhoto = (id, formData) => api.put(`/inventory/${id}/photo`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Видалити
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);

export default api;