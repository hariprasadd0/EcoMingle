import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetails, updateProduct, deleteProduct } from '../api/api';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Chip,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import DialogBox from '../components/DialogBox';
import { Add, RemoveCircle } from '@mui/icons-material';
const DetailProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    // Fetch product details based on the id
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await getProductDetails(id);
        setProduct(response.data?.data.product);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error(error);
      }
    };
    fetchProductDetails();
  }, [id, update]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const productItem = product?.productItems[0];

  if (!id) {
    return <Typography>Product not found</Typography>;
  }
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        opacity={0.5}
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleQuantityChange = (newValue) => {
    const value = Math.max(1, Math.min(newValue, productItem.inventoryCount));
    setQuantity(value);
  };
  const handleUpdateProduct = async (data) => {
    setLoading(true);
    const res = await updateProduct(data, id);
    console.log(res);
    setLoading(false);
    if (res.status === 200) {
      setUpdate(true);
    }
    setOpen(false);
  };
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      const res = await deleteProduct(id);
      console.log(res);

      if (res.status === 200) {
        navigate('/products', { replace: true });
      }
      setLoading(false);
      setOpen(false);
    } catch (error) {
      throw new Error('Error deleting product');
    }
  };
  const fields = [
    { name: 'productName', label: 'Product Name', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'description', label: 'Description', multiline: true, rows: 4 },
    {
      name: 'category',
      label: 'Category',
      select: true,
      required: true,
      options: ['Electronics', 'Fashion', 'Home Appliances'],
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  return (
    <Card sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      {update && (
        <Snackbar
          open={update}
          autoHideDuration={3000}
          onClose={() => setUpdate(false)}
        >
          <Alert severity="success">Product updated successfully</Alert>
        </Snackbar>
      )}
      {product && (
        <CardContent>
          <Grid container spacing={4}>
            {/* Left side - Images */}
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

            {/* Right side - Product Details */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
              >
                <Typography variant="h5">{product.productName}</Typography>

                <Chip
                  label={product.category}
                  variant="filled"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ${product.price.toFixed(2)}
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description}
              </Typography>

              {/* Quantity Selector */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1">
                  Quantity ({productItem?.inventoryCount} available)
                </Typography>
                {productItem?.inventoryCount < 15 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Low stock! Only {productItem?.inventoryCount} items left
                  </Alert>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <RemoveCircle />
                  </IconButton>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number(e.target.value))
                    }
                    inputProps={{
                      min: 1,
                      max: productItem?.inventoryCount,
                      style: { textAlign: 'center' },
                    }}
                    sx={{ width: 80 }}
                  />
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= productItem?.inventoryCount}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              {/* Additional Details */}
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body2">SKU: {productItem?.SKU}</Typography>
                <Typography variant="body2">
                  Added: {formatDate(product.createdAt)}
                </Typography>
                <Typography variant="body2">
                  Last Updated: {formatDate(product.updatedAt)}
                </Typography>
              </Stack>

              {/* Add to Cart Button */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  type="button"
                  disableRipple
                  onClick={() => setOpen(true)}
                >
                  update product
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  color="warning"
                  fullWidth
                  type="button"
                  disableRipple
                  onClick={handleDeleteProduct}
                >
                  delete product
                </Button>
              </Box>
              <DialogBox
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleUpdateProduct}
                fields={fields}
                defaultValues={{ productName: '', price: '', description: '' }}
                Title="Update Product"
              />
            </Grid>
          </Grid>
        </CardContent>
      )}
    </Card>
  );
};

export default DetailProduct;
