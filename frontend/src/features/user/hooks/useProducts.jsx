import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getProductByCategory } from '../../product/productSlice.js';
import { getProductsThunk } from '../../product/productSlice.js';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.product);

  const [category, setCategory] = useState(null);

  const fetchProductsByCategory = (category) => {
    dispatch(getProductByCategory(category));
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProductsThunk());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (category) {
      fetchProductsByCategory(category);
    } else {
      dispatch(getProductsThunk());
    }
  }, [category, dispatch]);

  return { products, status, setCategory };
};
