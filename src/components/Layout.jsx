import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  const isAdminActive = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex items-center">
                <Link to="/admin/inventory" className="text-xl font-bold text-indigo-600">
                  InventoryManager
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin/inventory"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isAdminActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📦 Інвентар (адмін)
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;