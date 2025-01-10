import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../features/auth/pages/Login';
import ForgetPassword from '../features/auth/pages/ForgetPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/user/pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Profile from '../features/user/pages/Profile';
import NotFound from '../components/NotFound';
import Catalog from '../features/user/pages/Catalog';
import ProductPage from '../features/user/pages/Product';
import Cart from '../features/user/pages/Cart';
import Checkout from '../features/user/pages/Checkout';
import Wishlist from '../features/user/pages/Wishlist';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import Users from '../features/admin/pages/Users';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import UserPage from '../features/admin/pages/UserPage';
import ProductList from '../features/admin/pages/ProductList';
import ProductListPage from '../features/admin/pages/ProductListPage';
import VendorRegister from '../features/auth/pages/VendorRegister';
import Vendor from '../features/admin/pages/vendor/Vendor';
import VendorLogin from '../features/auth/pages/vendorLogin';

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const role = user?.user?.role || user?.data?.user?.role || null;

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  useEffect(() => {
    setIsAuthChecked(true);
  }, [isAuthenticated]);
  if (!isAuthChecked) {
    return <div>loading...</div>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/vendor-register" element={<VendorRegister />} />
      <Route path="/vendor-login" element={<VendorLogin />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            role === 'user' ? (
              <Dashboard />
            ) : role === 'admin' ? (
              <ProtectedRoute
                requiredRoles={['admin']}
                element={AdminDashboard}
              />
            ) : (
              <Navigate to="/login" />
            )
          ) : (
            <Dashboard />
          )
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredRoles={['user', 'admin']} element={Profile} />
        }
      />
      <Route
        path="/wishlist"
        element={<ProtectedRoute requiredRoles={['user']} element={Wishlist} />}
      />
      <Route
        path="/cart/checkout"
        element={<ProtectedRoute requiredRoles={['user']} element={Checkout} />}
      />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/catalog/:category" element={<Catalog />} />
      <Route path="/cart" element={<Cart />} />

      {/* Admin Routes */}

      <Route
        path="/users"
        element={<ProtectedRoute requiredRoles={['admin']} element={Users} />}
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute requiredRoles={['admin']} element={UserPage} />
        }
      />

      <Route
        path="/all-products"
        element={
          <ProtectedRoute requiredRoles={['admin']} element={ProductList} />
        }
      />
      <Route
        path="/all-products/:id"
        element={
          <ProtectedRoute requiredRoles={['admin']} element={ProductListPage} />
        }
      />
      <Route
        path="/vendors/:id"
        element={<ProtectedRoute requiredRoles={['admin']} element={Vendor} />}
      />
    </Routes>
  );
};

export default AppRoutes;
