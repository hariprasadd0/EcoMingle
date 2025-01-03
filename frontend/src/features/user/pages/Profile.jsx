import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

import {
  LuUserCircle,
  LuMapPin,
  LuShoppingCart,
  LuHeart,
  LuKey,
} from 'react-icons/lu';
import { getOrders, getProfile } from '../api/profileApi.js';
import EmissionCard from '../../../components/EmissionCard';
import { useTheme } from '@mui/styles';

// Custom TabPanel component
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
};

const Profile = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data.data.profile);
        setAvatar(response.data.data.profile.username[0].toUpperCase());
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      console.log(response.data);

      setOrders(response.data);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              boxShadow: 'none',
              marginLeft: '-10px',
            }}
          >
            <Tabs
              orientation={isSmallScreen ? 'horizontal' : 'vertical'}
              variant="standard"
              indicatorColor="transparent"
              value={value}
              onChange={handleTabChange}
              aria-label="profile sidebar"
              sx={{
                borderRight: isSmallScreen ? 0 : 1, // No border for horizontal view
                borderBottom: isSmallScreen ? 1 : 0, // Add border to bottom when horizontal
                borderColor: 'divider',
                minHeight: isSmallScreen ? 'auto' : '100%', // Adjust height
                padding: '12px',
                color: 'text.secondary',
                '& .Mui-selected': {
                  backgroundColor: '#F6F6F6',
                  color: 'primary',
                },
              }}
            >
              <Tab
                disableRipple
                label={isSmallScreen ? '' : 'Account'}
                icon={<LuUserCircle size={22} />}
                iconPosition="start"
                sx={{
                  justifyContent: isSmallScreen ? 'center' : 'start', // Adjust alignment
                  fontWeight: 'medium',
                  gap: '5px',
                }}
              />
              <Tab
                onClick={fetchOrders}
                disableRipple
                label={isSmallScreen ? '' : 'Orders'}
                icon={<LuShoppingCart size={22} />}
                iconPosition="start"
                sx={{
                  justifyContent: isSmallScreen ? 'center' : 'start',
                  fontWeight: 'medium',
                  gap: '5px',
                }}
              />
              <Tab
                disableRipple
                label={isSmallScreen ? '' : 'Address'}
                icon={<LuMapPin size={22} />}
                iconPosition="start"
                sx={{
                  justifyContent: isSmallScreen ? 'center' : 'start',
                  fontWeight: 'medium',
                  gap: '5px',
                }}
              />
              <Tab
                disableRipple
                label={isSmallScreen ? '' : 'Password'}
                icon={<LuKey size={22} />}
                iconPosition="start"
                sx={{
                  justifyContent: isSmallScreen ? 'center' : 'start',
                  fontWeight: 'medium',
                  gap: '5px',
                }}
              />
            </Tabs>
          </Paper>
        </Grid>

        {/* Tab content */}
        <Grid item xs={12} md={9}>
          <TabPanel value={value} index={1}>
            <Typography variant="h6" gutterBottom>
              Orders
            </Typography>

            {/* Orders List */}
            {orders?.map((order) => (
              <Paper
                key={order._id}
                elevation={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={order.product?.ProductImage[0]} // Get the first image from ProductImage array
                    alt={order.product?.productName} // Use productName as alt text
                    style={{ width: 50, height: 50, marginRight: 16 }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {order.product?.productName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ordered On:{' '}
                      {new Date(order?.dateOrdered).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Total Price: ${order?.totalPrice.toFixed(2)}
                    </Typography>{' '}
                    {/* Display totalPrice */}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: order.status === 'delivered' ? 'green' : 'orange', // Check for delivered status
                      fontWeight: 'bold',
                      mr: 2,
                    }}
                  >
                    {order.status} {/* Display the order status */}
                  </Typography>
                  <Button variant="outlined" size="small">
                    View item
                  </Button>
                </Box>
              </Paper>
            ))}
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Typography variant="h6">Address</Typography>
            {/* Address content */}
          </TabPanel>

          <TabPanel value={value} index={3}>
            <Typography variant="h6">Password</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField />
                <TextField />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={0}>
            <Typography variant="h6">Account Detail</Typography>
            {profile && (
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      boxShadow: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 1,
                      border: '1px solid #E5E5E5',
                    }}
                  >
                    <Avatar
                      alt={profile.username}
                      src={avatar}
                      sx={{ width: 90, height: 90 }}
                    />
                    <Typography variant="h6">{profile.username}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email: {profile.email}
                    </Typography>
                    {profile.phone ? (
                      <Typography variant="body2" color="textSecondary">
                        Phone Number: {profile.phone}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Phone Number: nill
                      </Typography>
                    )}

                    <Button
                      disableElevation
                      disableRipple
                      size="small"
                      variant="contained"
                    >
                      Edit profile
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <EmissionCard
                    userName={profile?.username || 'User'}
                    totalEmission={profile?.totalEmission || 0}
                    emissionReduction={profile?.emissionReduction || 0}
                  />
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
