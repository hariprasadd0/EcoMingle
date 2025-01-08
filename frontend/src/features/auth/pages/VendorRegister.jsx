import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Chip,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { registerVendor } from '../../vendor/vendorSlice.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const VendorRegister = () => {
  const { success, error } = useSelector((state) => state.vendor);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (success) {
      setSnackbarMessage('Registration successful!');
      setSnackbarSeverity('success');
      setOpen(true);
    }

    if (error) {
      setSnackbarMessage(`Error: ${error.message || 'Something went wrong'}`);
      setSnackbarSeverity('error');
      setOpen(true);
    }
  }, [success, error]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategoryAdd = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      event.preventDefault();
      setCategories([...categories, event.target.value]);
      setValue('categories', [...categories, event.target.value]);
      event.target.value = '';
    }
  };

  const handleCategoryDelete = (categoryToDelete) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryToDelete,
    );
    setCategories(updatedCategories);
    setValue('categories', updatedCategories);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files;

    setValue('docfile', file);
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('description', data.description);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('categories', JSON.stringify(data.categories || []));

    if (data.docfile && data.docfile[0]) {
      formData.append('docfile', data.docfile[0]);
    }
    formData.append('location[address]', data.location.address);
    formData.append('location[city]', data.location.city);
    formData.append('location[state]', data.location.state);
    formData.append('location[country]', data.location.country);

    dispatch(registerVendor(formData));

    setCategories([]);
    reset();
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          maxWidth: 800,
          margin: '2rem auto',
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Vendor Registration
        </Typography>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    message: 'Invalid phone number format',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="location.address"
                control={control}
                defaultValue=""
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    variant="outlined"
                    error={!!errors.location?.address}
                    helperText={errors.location?.address?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="location.city"
                control={control}
                defaultValue=""
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    variant="outlined"
                    error={!!errors.location?.city}
                    helperText={errors.location?.city?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="location.state"
                control={control}
                defaultValue=""
                rules={{ required: 'State is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="State"
                    variant="outlined"
                    error={!!errors.location?.state}
                    helperText={errors.location?.state?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="location.country"
                control={control}
                defaultValue=""
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country"
                    variant="outlined"
                    error={!!errors.location?.country}
                    helperText={errors.location?.country?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="categories"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Box>
                    <TextField
                      label="Add Category"
                      variant="outlined"
                      onKeyDown={handleCategoryAdd}
                      placeholder="Press Enter to add"
                      fullWidth
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                        marginTop: 1,
                      }}
                    >
                      {categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          onDelete={() => handleCategoryDelete(category)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {errors.categories && (
                      <Typography color="error">
                        {errors.categories.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="application/pdf"
                id="upload-button"
                type="file"
                name="docfile"
                onChange={handleFileUpload}
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
              <Button
                onClick={() => navigate('/vendor-login')}
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default VendorRegister;
