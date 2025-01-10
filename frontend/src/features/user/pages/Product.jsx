import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
} from '@mui/material';
import { Add, Remove, Star } from '@mui/icons-material';
import { LuHeart, LuShare2 } from 'react-icons/lu';
import { BiColorFill } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../product/api.js';
import ProductCarousel from '../components/prodcutCarousel/ProductCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../cartSlice.js';

const ProductPage = () => {
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProduct(id);
      setProduct(response.data.data.product);
      console.log(response.data.data.product);
    };

    fetchProduct();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <IoClose fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  if (!product || !product.ProductImage || !product.productItems) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="auto"
                sx={{ paddingTop: '100%' }}
              />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              {[1, 2, 3, 4].map((index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={60}
                  height={60}
                  sx={{ mx: 1 }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />{' '}
            {/* Product Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="text" width={120} height={24} /> {/* Rating */}
              <Skeleton
                variant="text"
                width={100}
                height={24}
                sx={{ ml: 1 }}
              />{' '}
              {/* Review count */}
              <Skeleton
                variant="rectangular"
                width={80}
                height={24}
                sx={{ ml: 2 }}
              />{' '}
              {/* Stock status */}
            </Box>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />{' '}
            {/* Price */}
            <Skeleton
              variant="text"
              width="60%"
              height={24}
              sx={{ mb: 1 }}
            />{' '}
            {/* AVAILABLE COLORS */}
            <Box sx={{ mb: 2 }}>
              {[1, 2, 3].map((index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 1, display: 'inline-block' }}
                />
              ))}
            </Box>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />{' '}
            {/* MATERIAL */}
            <Box sx={{ mb: 2 }}>
              {[1, 2, 3].map((index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 1, display: 'inline-block' }}
                />
              ))}
            </Box>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />{' '}
            {/* SELECT SIZE */}
            <Box sx={{ mb: 2 }}>
              {['S', 'M', 'X', 'XL', 'XXL'].map((size) => (
                <Skeleton
                  key={size}
                  variant="rectangular"
                  width={40}
                  height={32}
                  sx={{ mr: 1, display: 'inline-block' }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="text" width={80} height={24} sx={{ mr: 2 }} />{' '}
              {/* QUANTITY */}
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={20} height={24} sx={{ mx: 2 }} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={48}
              sx={{ mb: 2 }}
            />{' '}
            {/* Add to cart button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Skeleton variant="text" width="60%" height={20} />{' '}
              {/* Shipping info */}
              <Box>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 1, display: 'inline-block' }}
                />
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ display: 'inline-block' }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    ); // Show a loading state while fetching data
  }

  const inventoryCount = product.productItems[0]?.inventoryCount;

  const Icons = [BiColorFill, BiColorFill, BiColorFill];

  const handleAddToCart = () => {
    const data = {
      productId: product._id,
      quantity: quantity,
    };

    dispatch(addToCart(data));
    setOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, boxShadow: 'none' }}>
            <ProductCarousel product={product} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5" gutterBottom>
              {product?.productName}
            </Typography>
            <IconButton>
              <LuShare2 />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              sx={{ fontSize: '11px', backgroundColor: '#F6F6F6' }}
              size="small"
              icon={<Star fontSize="small" />}
              label={'4.2 — 54 Reviews'}
            />

            {inventoryCount <= 0 ? (
              <Chip
                variant="outlined"
                label="OUT OF STOCK"
                color="error"
                size="small"
                sx={{ ml: 2, borderRadius: '50px', fontSize: '10px' }}
              />
            ) : (
              <Chip
                variant="outlined"
                label="IN STOCK"
                size="small"
                sx={{
                  ml: 2,
                  borderRadius: '50px',
                  fontSize: '10px',
                }}
              />
            )}
          </Box>

          <Typography variant="h6" gutterBottom>
            ${product.price}
          </Typography>
          <Typography
            color={'#5C5F6A'}
            variant="subtitle1"
            fontSize={12}
            gutterBottom
          >
            AVAILABLE COLORS
          </Typography>
          <Box sx={{ mb: 2 }}>
            {['#B8C5F2', '#FFD699', '#A5D6A7'].map((color) => (
              <Box
                key={color}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: color,
                  display: 'inline-block',
                  mr: 1,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
          <Typography
            color={'#5C5F6A'}
            variant="subtitle1"
            fontSize={12}
            gutterBottom
          >
            MATERIAL
          </Typography>
          <Box sx={{ mb: 2 }}>
            {Icons.map((Icon, i) => (
              <Box
                key={i}
                component="span"
                className="material-icons"
                sx={{ mr: 1, gap: '2' }}
              >
                <Icon size={20} />
              </Box>
            ))}
          </Box>
          <Typography variant="subtitle1" fontSize={12} gutterBottom>
            SELECT SIZE
          </Typography>
          <Box sx={{ mb: 2 }}>
            {['S', 'M', 'X', 'XL', 'XXL'].map((size) => (
              <Button
                key={size}
                variant="outlined"
                size="small"
                disableRipple
                sx={{
                  mr: 1,
                  minWidth: 'auto',
                  border: '1px solid #E6E7E8',
                  color: '#5C5F6A',
                  '&:hover': { border: '1.3px solid black', color: 'black' },
                }}
              >
                {size}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontSize={12} sx={{ mr: 2 }}>
              QUANTITY
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #3333',
                borderRadius: '5px',
                gap: 1,
                width: '120px',
              }}
            >
              <IconButton size="small">
                <Remove
                  onClick={() =>
                    setQuantity((prevQuantity) =>
                      prevQuantity > 1 ? prevQuantity - 1 : 1,
                    )
                  }
                />
              </IconButton>
              <Typography sx={{ mx: 2 }}>{quantity}</Typography>
              <IconButton size="small">
                <Add
                  onClick={() =>
                    setQuantity((prevQuantity) => prevQuantity + 1)
                  }
                />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleAddToCart}
              variant="contained"
              disableElevation
              sx={{
                width: '70%',
                mb: 2,
                backgroundColor: 'primary.main',
                fontWeight: '500',
                '&:hover': { backgroundColor: '#45a049' },
              }}
            >
              Add to cart
            </Button>
            <Button
              sx={{ mb: 2, padding: 0, border: '1px solid #E6E7E8' }}
              variant="outlined"
            >
              <LuHeart size={20} />
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" fontSize={12}>
              — FREE SHIPPING ON ORDERS $100+
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={`${product.productName} Added to Cart`}
        action={action}
      />
    </Box>
  );
};

export default ProductPage;
