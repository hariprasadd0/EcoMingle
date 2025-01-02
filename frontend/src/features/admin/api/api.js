import api from '../../../utils/api.js';

export const getAllUsers = async () => {
  return await api.get('/admin/users');
};

export const getUserById = async (id) => {
  return await api.get(`/admin/users/${id}`);
};

export const getAllProducts = async () => {
  return await api.get('/admin/products');
};

export const getProductById = async (id) => {
  return await api.get(`/admin/products/${id}`);
};

export const getVendorApplication = async () => {
  return await api.get('/admin/vendors/applications');
};

export const getVendorById = async (id) => {
  return await api.get(`/admin/vendors/${id}`);
};

export const approveVendor = async (id) => {
  return await api.post(`/admin/vendors/approve/${id}`);
};
export const rejectVendor = async (id) => {
  return await api.post(`/admin/vendors/reject/${id}`);
};

export const updateProductStatus = async (id) => {
  return await api.post(`/admin/products/${id}`);
};
