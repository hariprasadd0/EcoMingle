import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  Alert,
} from '@mui/material';

const ProductItemDialog = ({
  open,
  onClose,
  onSubmit,
  defaultValues = {},
  currentItem,
}) => {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      SKU: currentItem?.SKU || '',
      inventoryCount: currentItem?.inventoryCount || 0,
      discount: currentItem?.discount || 0,
      oldPrice: currentItem?.oldPrice || '',
      newPrice: currentItem?.newPrice || '',
      promotionCategory: currentItem?.promotionCategory || '',
      promotionActive: currentItem?.promotionActive || false,
      ...defaultValues,
    },
  });

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to update product item');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Product Item</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="SKU"
              fullWidth
              {...register('SKU')}
              error={!!errors.SKU}
              helperText={errors.SKU?.message}
            />

            <TextField
              label="Inventory Count"
              type="number"
              fullWidth
              {...register('inventoryCount', {
                min: { value: 0, message: 'Inventory cannot be negative' },
              })}
              error={!!errors.inventoryCount}
              helperText={errors.inventoryCount?.message}
            />

            <TextField
              label="Discount (%)"
              type="number"
              fullWidth
              {...register('discount', {
                required: 'Discount is required',
                min: { value: 0, message: 'Discount cannot be negative' },
                max: { value: 100, message: 'Discount cannot exceed 100%' },
              })}
              error={!!errors.discount}
              helperText={errors.discount?.message}
            />

            <TextField
              label="Old Price"
              type="number"
              fullWidth
              {...register('oldPrice', {
                min: { value: 0, message: 'Price cannot be negative' },
              })}
              error={!!errors.oldPrice}
              helperText={errors.oldPrice?.message}
            />

            <TextField
              label="New Price"
              type="number"
              fullWidth
              {...register('newPrice', {
                min: { value: 0, message: 'Price cannot be negative' },
              })}
              error={!!errors.newPrice}
              helperText={errors.newPrice?.message}
            />

            <TextField
              label="Promotion Category"
              fullWidth
              {...register('promotionCategory')}
              error={!!errors.promotionCategory}
              helperText={errors.promotionCategory?.message}
            />

            <FormControlLabel
              control={
                <Switch
                  {...register('promotionActive')}
                  defaultChecked={currentItem?.promotionActive}
                />
              }
              label="Promotion Active"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductItemDialog;
