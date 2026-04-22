import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.fetchInventory();
      setInventory(response.data);
    } catch (err) {
      setError('Не вдалося завантажити інвентар');
      toast.error('Помилка завантаження');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = async (formData) => {
    try {
      await api.createInventory(formData);
      await loadInventory();
      toast.success('Інвентар успішно додано');
      return true;
    } catch (err) {
      toast.error('Помилка створення');
      console.error(err);
      return false;
    }
  };

  const updateText = async (id, data) => {
    try {
      await api.updateInventoryText(id, data);
      await loadInventory();
      toast.success('Текстові дані оновлено');
      return true;
    } catch (err) {
      toast.error('Помилка оновлення тексту');
      console.error(err);
      return false;
    }
  };

  const updatePhoto = async (id, formData) => {
    try {
      await api.updateInventoryPhoto(id, formData);
      await loadInventory();
      toast.success('Фото оновлено');
      return true;
    } catch (err) {
      toast.error('Помилка оновлення фото');
      console.error(err);
      return false;
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.deleteInventory(id);
      await loadInventory();
      toast.success('Інвентар видалено');
      return true;
    } catch (err) {
      toast.error('Помилка видалення');
      console.error(err);
      return false;
    }
  };

  const value = {
    inventory,
    loading,
    error,
    loadInventory,
    createItem,
    updateText,
    updatePhoto,
    deleteItem,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};