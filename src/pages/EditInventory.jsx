import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import { fetchInventoryItem } from '../services/api';

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateText, updatePhoto } = useInventory();
  
  const [textData, setTextData] = useState({
    inventory_name: '',
    description: '',
  });
  const [textErrors, setTextErrors] = useState({});
  const [textSubmitting, setTextSubmitting] = useState(false);
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoSubmitting, setPhotoSubmitting] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await fetchInventoryItem(id);
        setTextData({
          inventory_name: response.data.inventory_name,
          description: response.data.description || '',
        });
        setCurrentPhotoUrl(`${import.meta.env.VITE_API_URL}/inventory/${id}/photo`);
        setLoading(false);
      } catch (err) {
        setError('Не вдалося завантажити дані');
        setLoading(false);
        console.error(err);
      }
    };
    loadItem();
  }, [id]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setTextData(prev => ({ ...prev, [name]: value }));
    if (textErrors[name]) {
      setTextErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateText = () => {
    const errors = {};
    if (!textData.inventory_name.trim()) {
      errors.inventory_name = "Назва обов'язкова";
    }
    setTextErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!validateText()) return;
    
    setTextSubmitting(true);
    const success = await updateText(id, {
      inventory_name: textData.inventory_name,
      description: textData.description,
    });
    setTextSubmitting(false);
    if (success) {
      navigate('/admin/inventory');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) return;
    
    setPhotoSubmitting(true);
    const formData = new FormData();
    formData.append('photo', photoFile);
    const success = await updatePhoto(id, formData);
    setPhotoSubmitting(false);
    if (success) {
      setCurrentPhotoUrl(URL.createObjectURL(photoFile));
      setPhotoFile(null);
      setPhotoPreview(null);
    }
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
        <button onClick={() => navigate('/admin/inventory')} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md">
          Повернутись до списку
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Редагування інвентарю #{id}</h1>
        
        <div className="mb-10 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Оновлення текстової інформації</h2>
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Назва інвентарю <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="inventory_name"
                value={textData.inventory_name}
                onChange={handleTextChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  textErrors.inventory_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {textErrors.inventory_name && <p className="mt-1 text-sm text-red-600">{textErrors.inventory_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
              <textarea
                name="description"
                rows="4"
                value={textData.description}
                onChange={handleTextChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={textSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {textSubmitting ? 'Збереження...' : 'Оновити текстові дані'}
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Оновлення фотографії</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Поточне фото:</p>
            <img
              src={currentPhotoUrl}
              alt="Current"
              className="h-32 w-32 object-cover rounded-md shadow"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/128?text=No+Image'; }}
            />
          </div>
          
          <form onSubmit={handlePhotoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Нове фото
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-sm text-gray-500"
              />
              {photoPreview && (
                <div className="mt-3">
                  <img src={photoPreview} alt="Preview" className="h-32 w-32 object-cover rounded-md shadow" />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/inventory')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Повернутись до списку
              </button>
              <button
                type="submit"
                disabled={!photoFile || photoSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {photoSubmitting ? 'Оновлення...' : 'Оновити фото'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditInventory;