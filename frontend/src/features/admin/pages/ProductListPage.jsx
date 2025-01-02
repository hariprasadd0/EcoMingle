import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, updateProductStatus } from '../api/api';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Button,
  Stack,
} from '@mui/material';
import { MdEdit, MdDelete } from 'react-icons/md';

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (!product)
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
        No product data available
      </Typography>
    );

  const handleEdit = () => {};

  const handleDelete = () => {};

  const handleProductStatus = async () => {
    try {
      const res = await updateProductStatus(product._id);
      setProduct(res.data.data);
    } catch (error) {
      throw new Error('Error updating product status:');
    }
  };
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 1000,
        margin: '2rem auto',
        borderRadius: 2,
      }}
    >
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={product.ProductImage[selectedImage]}
              alt={product.productName}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              {product.ProductImage.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    borderRadius: 1,
                    border:
                      selectedImage === index
                        ? '2px solid primary.main'
                        : 'none',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h4" fontWeight="bold">
              {product.productName}
            </Typography>
            <Typography variant="h5" color="primary">
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
              {product.description}
            </Typography>
            <Typography variant="body2">
              <strong>Vendor:</strong> {product.vendor}
            </Typography>
            <Typography variant="body2">
              <strong>Category:</strong> {product.category}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {product.status}
            </Typography>
            <Typography variant="body2">
              <strong>Created At:</strong>{' '}
              {new Date(product.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Updated At:</strong>{' '}
              {new Date(product.updatedAt).toLocaleString()}
            </Typography>
          </Box>
        </Grid>

        {/* Admin Actions */}
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Tooltip title="Edit Product">
            <IconButton onClick={handleEdit} color="primary">
              <MdEdit size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton onClick={handleDelete} color="error">
              <MdDelete size={24} />
            </IconButton>
          </Tooltip>

          {product.status === 'active' ? (
            <Button
              variant="contained"
              color="error"
              onClick={handleProductStatus}
            >
              Deactivate Product
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleProductStatus}
            >
              Activate Product
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductPage;
