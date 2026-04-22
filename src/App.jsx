import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { InventoryProvider } from './contexts/InventoryContext';
import Layout from './components/Layout';
import AdminInventoryList from './pages/AdminInventoryList';
import CreateInventory from './pages/CreateInventory';
import EditInventory from './pages/EditInventory';

function App() {
  return (
    <BrowserRouter>
      <InventoryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/inventory" replace />} />
            <Route path="/admin/inventory" element={<AdminInventoryList />} />
            <Route path="/admin/inventory/new" element={<CreateInventory />} />
            <Route path="/admin/inventory/:id/edit" element={<EditInventory />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </InventoryProvider>
    </BrowserRouter>
  );
}

export default App;