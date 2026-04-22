import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';

const CreateInventory = () => {
  const navigate = useNavigate();
  const { createItem } = useInventory();
  
  const [formData, setFormData] = useState({
    inventory_name: '',
    description: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, photo: null }));
      setPreview(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.inventory_name.trim()) {
      newErrors.inventory_name = "Назва інвентарю обов'язкова";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    const submitFormData = new FormData();
    submitFormData.append('inventory_name', formData.inventory_name);
    submitFormData.append('description', formData.description);
    if (formData.photo) {
      submitFormData.append('photo', formData.photo);
    }
    
    const success = await createItem(submitFormData);
    setSubmitting(false);
    
    if (success) {
      navigate('/admin/inventory');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Додати новий інвентар</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва інвентарю <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="inventory_name"
              value={formData.inventory_name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.inventory_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.inventory_name && (
              <p className="mt-1 text-sm text-red-600">{errors.inventory_name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Опис
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Фото
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-md shadow" />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/inventory')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Збереження...' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInventory;