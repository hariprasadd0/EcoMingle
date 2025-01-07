import api from '../../../utils/api';

export const vendorRegister = async (data) => {
  return await api.post(`/vendor/register`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    skipInterceptor: true,
  });
};

export const vendorLogin = async (data) => {
  return await api.post('/vendor/login', data, {
    skipInterceptor: true,
  });
};

export const getProfile = async (vId) => {
  return await api.get(`/vendor/profile/${vId}`);
};

export const getProducts = async (vId) => {
  return await api.get(`/vendor/products/${vId}`);
};

export const getProductDetails = async (id) => {
  return await api.get(`/vendor/product/${id}`);
};

export const addNewProduct = async (data) => {
  return await api.post(`/vendor/add-product`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = async (data, id) => {
  return await api.patch(`/vendor/products/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = async (id) => {
  return await api.delete(`/vendor/products/${id}`);
};

export const logout = async () => {
  return await api.post('/user/logout', { skipInterceptor: true });
};
