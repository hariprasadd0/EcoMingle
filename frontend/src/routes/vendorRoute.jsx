import { Routes, Route, Navigate } from 'react-router-dom';
import DetailProduct from '../features/vendor/pages/DetailProduct';

import VendorDashboard from '../features/vendor/pages/VendorDashboard';
import Profile from '../features/vendor/pages/Profile';
import Products from '../features/vendor/pages/Products';

const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to={'/vendor-dashboard'} replace />} />
      <Route path="/vendor-dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/profile" element={<Profile />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<DetailProduct />} />
    </Routes>
  );
};

export default VendorRoutes;
