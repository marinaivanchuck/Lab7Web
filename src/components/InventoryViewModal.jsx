import { useState, useEffect } from 'react';
import { fetchInventoryItem } from '../services/api';

const InventoryViewModal = ({ isOpen, onClose, inventoryId }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && inventoryId) {
      const loadItem = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetchInventoryItem(inventoryId);
          setItem(response.data);
        } catch (err) {
          setError('Не вдалося завантажити деталі');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadItem();
    }
  }, [isOpen, inventoryId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Деталі інвентарю</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          
          <div className="p-6">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}
            
            {error && (
              <div className="text-center py-8 text-red-600">{error}</div>
            )}
            
            {item && !loading && (
              <div className="space-y-4">
                {item.photo && (
                  <div className="flex justify-center">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/inventory/${item.id}/photo`}
                      alt={item.inventory_name}
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                    />
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800">Назва:</h3>
                  <p className="text-gray-700 mt-1">{item.inventory_name}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Опис:</h3>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">{item.description || '—'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryViewModal;