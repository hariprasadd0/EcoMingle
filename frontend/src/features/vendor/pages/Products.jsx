import { useState, useEffect } from 'react';
import { getProducts } from '../api/api.js';
import { useSelector } from 'react-redux';
import ProductList from '../components/ProductList.jsx';
import { Typography, Box, CircularProgress } from '@mui/material';
import { SearchAndFilter } from '../components/SearchAndFilter.jsx';
import SearchInput from '../components/SearchInput';
import FilterDropdown from '../components/FilterDropdown.jsx';
const Products = () => {
  const { vendor } = useSelector((state) => state.vendor);

  const vId = vendor?.data?._id || vendor?._id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Vendor ID:', vId);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(vId);
        setProducts(response.data.data.products);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (vId) {
      fetchProducts();
    }
  }, [vId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <SearchAndFilter products={products}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <SearchInput />
          <FilterDropdown />
        </Box>
        <ProductList />
      </SearchAndFilter>
    </Box>
  );
};

export default Products;
