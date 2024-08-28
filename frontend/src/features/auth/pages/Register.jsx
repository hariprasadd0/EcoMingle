import { Box } from '@mui/material';
import Form from '../components/Form';
import { useState } from 'react';
import { register } from '../api';

const Register = () => {
  // Define form state
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: null,
  });

  // Define form fields
  const fields = [
    {
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your name',
    },
    {
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    },
    {
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    },
  ];
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    if (error.error) {
      setError({
        error: false,
        message: null,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await register(values);
      console.log('response', response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError({
        error: true,
        message: err.response?.data?.message || 'An error occurred',
      });
      console.log('err', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 350,
        margin: 'auto',
        height: '90vh',
      }}
    >
      <Form
        error={error.error}
        helperText={error.message}
        variant={'Create Account'}
        fields={fields}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        loading={loading}
      />
    </Box>
  );
};

export default Register;