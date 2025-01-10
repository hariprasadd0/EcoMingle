import api from '../../utils/api';

export const getProducts = () => {
  return api.get('/user/all-products');
};
export const getProductsByCategory = (category) => {
  return api.get(`user/category/?category=${category}`);
};

export const getProduct = (id) => {
  return api.get(`/user/products/${id}`);
};

export const createProduct = (data) => {
  return api.post('/vendor/products', data);
};

export const updateProduct = (id, data) => {
  return api.put(`/vendor/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return api.delete(`/vendor/products/${id}`);
};
