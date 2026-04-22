import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import ConfirmModal from '../components/ConfirmModal';
import InventoryViewModal from '../components/InventoryViewModal';

const AdminInventoryList = () => {
  const { inventory, loading, error, loadInventory, deleteItem } = useInventory();
  const [deleteId, setDeleteId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteItem(deleteId);
      setDeleteId(null);
    }
  };

  const handleViewClick = (id) => {
    setViewId(id);
    setShowViewModal(true);
  };

  const getPhotoUrl = (id) => {
    return `${import.meta.env.VITE_API_URL}/inventory/${id}/photo`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadInventory}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Управління інвентарем</h1>
        <Link
          to="/admin/inventory/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
        >
          + Додати інвентар
        </Link>
      </div>

      {inventory.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Немає жодної позиції інвентарю</p>
          <Link
            to="/admin/inventory/new"
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Додати перший інвентар
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Фото
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Назва
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Опис
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={getPhotoUrl(item.id)}
                          alt={item.inventory_name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=No+img'; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.inventory_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {item.description || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleViewClick(item.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Переглянути"
                      >
                        👁️
                      </button>
                      <Link
                        to={`/admin/inventory/${item.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Редагувати"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Видалити"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Підтвердження видалення"
        message="Ви впевнені, що хочете видалити цю позицію? Цю дію неможливо скасувати."
      />

      <InventoryViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        inventoryId={viewId}
      />
    </div>
  );
};

export default AdminInventoryList;